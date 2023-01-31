const TableDocumentos = document.getElementById('tableListaDocumentos');
const endPointDocuments = {
    "GetAllDocuments": "https://dsortapi-apim.azure-api.net/api/Document/getAllDocuments",
    "DeleteDocumentID": "https://dsortapi-apim.azure-api.net/api/Document/deleteDocumentWithId/",
    "CreateNewDocument": "https://dsortapi-apim.azure-api.net/api/Document/createNewDocument",
    "UpdateDocument": "https://dsortapi-apim.azure-api.net/api/Document/updateNewDocument/",
    "GetDocumentID": "https://dsortapi-apim.azure-api.net/api/Document/getDocumentWithId/",
    "UploadScan":  "https://dsortapi-apim.azure-api.net/api/FileUpload/upload"
}

let documents = [];

async function GetAllDocumentos(){
    const conexaoAllDocuments = await fetch(endPointDocuments.GetAllDocuments);
    documents = await conexaoAllDocuments.json();   
    
    fillingDocTable(documents);
   
}

async function PostNewDocument(docTitle, docDescription, docAddress, file){    
    
    
    let tempScanPath = (`https://dsortstorage.blob.core.windows.net/files/${file.files[0].name}`).toString();

    if (file.files.length>0){
        await UploadScan(file);                
    }

    console.log(tempScanPath);
    const conexadoNewDocument = await fetch (`${endPointDocuments.CreateNewDocument}`, 
    {        
        method: "POST",        
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            DocTitle: docTitle,
            ScanPath: tempScanPath,
            Description: docDescription,
            PhisicalAddress: docAddress
        })
    });

    if (!conexadoNewDocument.ok){
        throw new Error("Não foi possível criar um novo documento");
    }
    const conexaoConvertida = await conexadoNewDocument.json();
    GetAllDocumentos();
    
}

async function getAllDeleteButtonDoc(){
    const buttonsDelete = await document.querySelectorAll("[data-btnDeleteDoc]");
    buttonsDelete.forEach(function (btn) {
        btn.addEventListener("click", () => DeleteDoc(btn.id))})}

 async function DeleteDoc(id){
            const conexadoDeleteDocument = await fetch (`${endPointDocuments.DeleteDocumentID}${id}`,
            {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json",
                    accept: "application/json"
                }
            });
            if (!conexadoDeleteDocument.ok){
                throw new Error("Not able to delete document with ID");
            }    
            GetAllDocumentos();  
        }
        
async function UploadScan(file){

    const formData = new FormData();
    formData.append("file", file.files[0]);

    try{
    const conexadoUploadScan = await fetch (endPointDocuments.UploadScan,{
        method: "POST",        
        body: formData
        })
    } catch (e){
        console.error(e);
    }
}
   

async function fillingDocTable(documents){

    if (documents.length==0) return;

    while (TableDocumentos.firstChild){
        TableDocumentos.removeChild(TableDocumentos.firstChild);
    }
    
    documents.forEach(doc => {        
        TableDocumentos.innerHTML += `
        <tr>
        <td>${doc.id}</td>
        <td>${doc.docTitle}</td>        
        <td>${doc.persons[0]}</td>
        <td>${doc.description}</td>
        <td>${doc.phisicalAddress}</td>
        <td>${doc.scanPath}</td>
        <td><button type="click" id="${doc.id}" data-btnDeleteDoc>X</button></td>
        </tr>
        `
    }); 

    getAllDeleteButtonDoc();
}

async function SearchDocument(term){

    // Get All Documents from DB
    const conexaoAllDocuments = await fetch(endPointDocuments.GetAllDocuments);
    documents = await conexaoAllDocuments.json();   

    // Declare new empty array of Documents relevant to the term searched
    let documentsRelevant = [];    

    // Include relevant terms in the array
    documents.forEach(doc => {     
        if (term ==="" || doc.docTitle.toLowerCase().includes(term.toLowerCase()) || doc.description.toLowerCase().includes(term.toLowerCase()) ){
            documentsRelevant.push(doc);                   
        }
    })

    fillingDocTable(documentsRelevant);
}

        
export const docFunctions = {
    GetAllDocumentos,
    PostNewDocument,
    DeleteDoc,
    SearchDocument    
}

