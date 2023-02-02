const TableDocumentos = document.getElementById('tableListaDocumentos');
const endPointDocuments = {
    "GetAllDocuments": "https://dsortapi-apim.azure-api.net/api/Document/getAllDocuments",
    "DeleteDocumentID": "https://dsortapi-apim.azure-api.net/api/Document/deleteDocumentWithId/",
    "CreateNewDocument": "https://dsortapi-apim.azure-api.net/api/Document/createNewDocument",
    "UpdateDocument": "https://dsortapi-apim.azure-api.net/api/Document/updateNewDocument/",
    "GetDocumentID": "https://dsortapi-apim.azure-api.net/api/Document/getDocumentWithId/",
    "UploadScan":  "https://dsortapi-apim.azure-api.net/api/FileUpload/upload",
    "AddPersonToDoc": "https://dsortapi-apim.azure-api.net/api/Person/personDocument"
}

let documents = [];
var latestDocumentCreatedId = 0;
var latestPersonSelectedId = 0;

async function GetAllDocumentos(){
    const conexaoAllDocuments = await fetch(endPointDocuments.GetAllDocuments);
    documents = await conexaoAllDocuments.json();   
    
    fillingDocTable(documents);
   
}

function UpdateLatestPersonSelectedId(id) {latestPersonSelectedId = id; }

async function PostNewDocument(docTitle, docDescription, docAddress, file){        
    
    let tempScanPath = "";

    if (file.files.length>0) {
        tempScanPath = (`https://dsortstorage.blob.core.windows.net/files/${file.files[0].name}`).toString();
        await UploadScan(file);                
    }
    
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

    if (!conexadoNewDocument.ok) throw new Error("Não foi possível criar um novo documento");

    else {
        const resonseDocJson = await conexadoNewDocument.json();  
        latestDocumentCreatedId = resonseDocJson.id;        

        AddPersonToDocument(latestDocumentCreatedId,latestPersonSelectedId);
        GetAllDocumentos();
    }    
    
}

async function getAllDeleteButtonDoc(){
    const buttonsDelete = await document.querySelectorAll("[data-btnDeleteDoc]");
    buttonsDelete.forEach(function (btn) {
        btn.addEventListener("click", () => DeleteDoc(btn.id))})
    }

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

    while (TableDocumentos.firstChild) {TableDocumentos.removeChild(TableDocumentos.firstChild); }

    let personName = "";
    
    documents.forEach(doc => {    
        personName = doc.persons.length >0 ? doc.persons[0].name : "";

        TableDocumentos.innerHTML += `
        <tr>
        <td>${doc.id}</td>
        <td>${doc.docTitle}</td>        
        <td>${personName}</td>
        <td>${doc.description}</td>
        <td>${doc.phisicalAddress}</td>
        <td><center>${doc.scanPath === "" ? "" : `<a class="fa-solid fa-download" href="${doc.scanPath}"></a>`}</td>
        <td><center><button type="click" id="${doc.id}" data-btnDeleteDoc>X</button></td>
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
        else if (doc.persons.length>0) {
            if (doc.persons[0].name.toLowerCase().includes(term.toLowerCase())) {
                documentsRelevant.push(doc); 
            }
        }
    })

    fillingDocTable(documentsRelevant);
}

async function AddPersonToDocument(idDoc, idPerson){    

    if (idPerson == 0 || idDoc == 0 ) return;

    const conexadoPersonToDoc = await fetch (endPointDocuments.AddPersonToDoc, 
    {        
        method: "POST",        
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            documentId: idDoc,
            personId: idPerson
        })
    });

    if (!conexadoPersonToDoc.ok) throw new Error("Not able to add person to doc");
}

        
export const docFunctions = {
    GetAllDocumentos,
    PostNewDocument,
    DeleteDoc,
    SearchDocument,
    AddPersonToDocument,
    UpdateLatestPersonSelectedId
}

