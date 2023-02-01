import {personFunctions} from "./personScript.js"
import {docFunctions} from "./documentScript.js"

personFunctions.GetAllPersons();
docFunctions.GetAllDocumentos();

const formularioCreateNewPerson = document.querySelector("[data-formularioNewPerson]").addEventListener("submit", evento => CriarPessoa (evento));
const formularioCreateNewDocument = document.querySelector("[data-formularioNewDoc]").addEventListener("submit", evento => CriarDocumento (evento));
const formularioUpdatePerson = document.querySelector("[data-formularioUpdatePerson]").addEventListener("submit", evento => UpdatePerson(evento));
const searchDocumentButton = document.querySelector("[data-btnsearchdocument]").addEventListener("click", evento => BuscarDoc(evento));



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
    const Address = document.querySelector("[data-docAddress]").value;
    const FileField = document.querySelector("[data-docScanPath]");          
    await GetPersonSelectedInForm();

    try {
    await docFunctions.PostNewDocument(Title,Description,Address, FileField);        

    } catch(e) {
        alert(e);
    }    
}

async function GetPersonSelectedInForm(){

    let radiosPersons = document.querySelectorAll('input[name="checkBoxNames"]');

    if (radiosPersons.length>0) {        
        radiosPersons.forEach(radio => {
            if (radio.checked) {                
                docFunctions.UpdateLatestPersonSelectedId(radio.id);
                return; 
            }
        })
    }
        else { 
            docFunctions.UpdateLatestPersonSelectedId(0);
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

