const TablePessoas = document.getElementById('tableListaPessoas');
const endPointPersons = {
    "GetAllPerson": "https://dsortapi-apim.azure-api.net/api/Person/getAllPerson",
    "DeletePersonId": "https://dsortapi-apim.azure-api.net/api/Person/deletePersonWithId/",
    "CreateNewPersonWithName": "https://dsortapi-apim.azure-api.net/api/Person/postNewPersonWithName/",
    "UpdatePerson": "https://dsortapi-apim.azure-api.net/api/Person/UpdateNewPerson"
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
    populateNewDocCheckboxes();
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
    buttonsDelete.forEach(function (btn) {btn.addEventListener("click", () => DeletePerson(btn.id))})}


async function UpdatePerson(id, newName){

    const conexadoUpdatePerson = await fetch (endPointPersons.UpdatePerson,
    {
        method: "PUT",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            Id: id,
            name: newName
        })

    });
    if (!conexadoUpdatePerson.ok){
        throw new Error("Not possible to update person");
    }    
    GetAllPersons();    
}

async function populateNewDocCheckboxes(){

const parentCheckboxes = document.querySelector("[data-checkboxesPersonParent]");

while (parentCheckboxes.firstChild){
    parentCheckboxes.removeChild(parentCheckboxes.firstChild);
}

const conexao = await fetch(endPointPersons.GetAllPerson);
const personsCurrent = await conexao.json();  

await personsCurrent.forEach(pessoa => {
    parentCheckboxes.innerHTML +=
    `<div class="child"><input type="radio" name="checkBoxNames" id="${pessoa.id}">${pessoa.name} |</div>`
})
}

export const personFunctions = {
    GetAllPersons, 
    PostNewPersonWithName,
    DeletePerson,
    UpdatePerson,
    populateNewDocCheckboxes
}
