import {personFunctions} from "./personScript.js"

const endpointDaAPI = 'https://dsortapi-apim.azure-api.net/api/Person/getAllPerson';
personFunctions.GetAllPersons();
const formularioCreateNewPerson = document.querySelector("[data-formularioNewPerson]");
formularioCreateNewPerson.addEventListener("submit", evento => CriarPessoa (evento));

async function CriarPessoa(evento){
    evento.preventDefault();   
    const nome = document.querySelector("[data-nomepessoa]").value;

    try {
    await personFunctions.PostNewPersonWithName(nome);
    } catch(e) {
        alert(e);
    }    
}


