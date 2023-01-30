const TableDocumentos = document.getElementById('tableListaDocumentos');
const endPointDocuments = {
    "GetAllDocuments": "https://dsortapi-apim.azure-api.net/api/Document/getAllDocuments",
    "DeleteDocumentID": "https://dsortapi-apim.azure-api.net/api/Document/deleteDocumentWithId/",
    "CreateNewDocument": "https://dsortapi-apim.azure-api.net/api/Document/createNewDocument",
    "UpdateDocument": "https://dsortapi-apim.azure-api.net/api/Document/updateNewDocument/",
    "GetDocumentID": "https://dsortapi-apim.azure-api.net/api/Document/getDocumentWithId/"
}

let documents = [];

async function GetAllDocumentos(){
    const conexaoAllDocuments = await fetch(endPointDocuments.GetAllDocuments);
    documents = await conexaoAllDocuments.json();   
    
    while (TableDocumentos.firstChild){
        TableDocumentos.removeChild(TableDocumentos.firstChild);
    }
    
    documents.forEach(doc => {        
        TableDocumentos.innerHTML += `
        <tr>
        <td>${doc.id}</td>
        <td>${doc.docTitle}</td>
        <td>${doc.scans.length}</td>
        <td>${doc.persons[0]}</td>
        <td>${doc.description}</td>
        <td>${doc.phisicalAddress}</td>
        <td><button type="click" id="${doc.id}" data-btnDeleteDoc>X</button></td>
        </tr>
        `
    }); 

    getAllDeleteButtonDoc();
}

async function PostNewDocument(docTitle, docDescription, docAddress){    

    const conexadoNewDocument = await fetch (`${endPointDocuments.CreateNewDocument}`, 
    {
        method: "POST",        
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            DocTitle: docTitle,
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
        

        
export const docFunctions = {
    GetAllDocumentos,
    PostNewDocument,
    DeleteDoc    
}
