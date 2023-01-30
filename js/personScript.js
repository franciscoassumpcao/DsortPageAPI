const TablePessoas = document.getElementById('tableListaPessoas');
const endPointPersons = {
    "GetAllPerson": "https://dsortapi-apim.azure-api.net/api/Person/getAllPerson",
    "DeletePersonId": "https://dsortapi-apim.azure-api.net/api/Person/deletePersonWithId/",
    "CreateNewPersonWithName": "https://dsortapi-apim.azure-api.net/api/Person/postNewPersonWithName/",
    "UpdatePerson": "https://dsortapi-apim.azure-api.net/api/Person/deletePersonWithId/"
}


let persons = [];

async function GetAllPersons(){
    const conexaoAllPerson = await fetch(endPointPersons.GetAllPerson);
    persons = await conexaoAllPerson.json();   
    
    while (TablePessoas.firstChild){
        TablePessoas.removeChild(TablePessoas.firstChild);
    }
    
    persons.forEach(pessoa => {        
        TablePessoas.innerHTML += `
        <tr>
        <td>${pessoa.id}</td>
        <td>${pessoa.name}</td>
        <td>0</td>
        <td><button type="click" id="${pessoa.id}" data-btnDelete>X</button></td>
        </tr>
        `
    }); 

    getAllDeleteButtonPerson();
}

async function PostNewPersonWithName(nome){    

    const conexaoNewPerson = await fetch (`${endPointPersons.CreateNewPersonWithName}${nome}`, 
    {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        }
    });

    if (!conexaoNewPerson.ok){
        throw new Error("Não foi possível criar pessoas");
    }
    const conexaoConvertida = await conexaoNewPerson.json();
    GetAllPersons();
    return conexaoConvertida;
}

async function DeletePerson(id){
    const conexadoDeletePerson = await fetch (`${endPointPersons.DeletePersonId}${id}`,
    {
        method: "DELETE",
        headers: {
            "Content-type": "application/json",
            accept: "application/json"
        }
    });
    if (!conexadoDeletePerson.ok){
        throw new Error("Não foi possível deletar pessoa com id");
    }    
    GetAllPersons();    
}


async function getAllDeleteButtonPerson(){
    const buttonsDelete = await document.querySelectorAll("[data-btnDelete]");
    buttonsDelete.forEach(function (btn) {
        btn.addEventListener("click", () => DeletePerson(btn.id))})}

export const personFunctions = {
    GetAllPersons, 
    PostNewPersonWithName,
    DeletePerson
}