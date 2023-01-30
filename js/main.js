import {personFunctions} from "./personScript.js"
import {docFunctions} from "./documentScript.js"

personFunctions.GetAllPersons();
docFunctions.GetAllDocumentos();

const formularioCreateNewPerson = document.querySelector("[data-formularioNewPerson]");
formularioCreateNewPerson.addEventListener("submit", evento => CriarPessoa (evento));

const formularioCreateNewDocument = document.querySelector("[data-formularioNewDoc]");
formularioCreateNewDocument.addEventListener("submit", evento => CriarDocumento (evento));

const formularioUpdatePerson = document.querySelector("[data-formularioUpdatePerson]");
formularioUpdatePerson.addEventListener("submit", evento => UpdatePerson(evento));


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

    try {
    await docFunctions.PostNewDocument(Title,Description,Address);
    } catch(e) {
        alert(e);
    }    
}


