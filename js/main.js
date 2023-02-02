import {personFunctions} from "./personScript.js"
import {docFunctions} from "./documentScript.js"

personFunctions.GetAllPersons();
docFunctions.GetAllDocumentos();

const formularioCreateNewPerson = document.querySelector("[data-formularioNewPerson]").addEventListener("submit", evento => CriarPessoa (evento));
const formularioCreateNewDocument = document.querySelector("[data-formularioNewDoc]").addEventListener("submit", evento => CriarDocumento (evento));
const formularioUpdatePerson = document.querySelector("[data-formularioUpdatePerson]").addEventListener("submit", evento => UpdatePerson(evento));
const searchDocumentButton = document.querySelector("[data-btnsearchdocument]").addEventListener("click", evento => BuscarDoc(evento));
const showAllDocumentsButton = document.querySelector("[data-btnshowAllDocuments]").addEventListener("click", evento => docFunctions.GetAllDocumentos());

async function CriarPessoa(evento){
    evento.preventDefault();   
    const nome = document.querySelector("[data-nomepessoa]").value;

    try {
    await personFunctions.PostNewPersonWithName(nome);
    } catch(e) {
        alert(e);
    }    
}

async function UpdatePerson(evento){
    evento.preventDefault();
    const id = document.querySelector("[data-idpessoa]").value;
    const nome = document.querySelector("[data-nomepessoaupdate]").value;

    try{
        await personFunctions.UpdatePerson(id, nome);

    } catch{
        console.log("Not possible to update person");
    }
}

async function CriarDocumento(evento){
    evento.preventDefault();   
    const Title = document.querySelector("[data-docTitle]").value;
    const Description = document.querySelector("[data-docDescription]").value;    
    const FileField = document.querySelector("[data-docScanPath]");          
    await GetCategorySelectedInForm();

    try {
    await docFunctions.PostNewDocument(Title,Description, FileField);        

    } catch(e) {
        alert(e);
    } finally {
        const TitleField = document.querySelector("[data-docTitle]");
        const DescriptionField = document.querySelector("[data-docDescription]");
        const FileField2 = document.querySelector("[data-docScanPath]");       

        TitleField.value = "";
        DescriptionField.value = "";
        FileField2.value = "";
    }
}



async function GetCategorySelectedInForm(){

    let radiosCategories = document.querySelectorAll('input[name="checkBoxNames"]');

    if (radiosCategories.length>0) {        
        radiosCategories.forEach(radio => {
            if (radio.checked) {                
                docFunctions.UpdateLatestCategorySelectedId(radio.id);
                console.log(`calling 1 ${radio.id}`);
                return; 
            }
            else {                
                console.log(`calling 2, with nothing`);
                return;
            }
        })
    }
        else {             
            console.log(`calling 3, with nothing`);
            return;
        }
}

async function BuscarDoc(evento){
    evento.preventDefault();   
    const termSearched = document.querySelector("[data-searchDocument]").value;

    try {
        await docFunctions.SearchDocument(termSearched);
    } catch (e) {
        console.log(`Error encontered ${e}, not possible to search for documents`);
    }

}

