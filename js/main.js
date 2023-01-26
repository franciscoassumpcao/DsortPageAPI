let persons = []
const endpointDaAPI = 'https://dsortapi-apim.azure-api.net/api/Person/getAllPerson';

getBuscarTodosDocumentosDaAPI();
const listaPessoasDiv = document.getElementById('listaPessoas');

async function getBuscarTodosDocumentosDaAPI(){
    const conexaoAllPerson = await fetch(endpointDaAPI)
    persons = await conexaoAllPerson.json();
    console.log(persons);
    
    persons.forEach(pessoa => {
        listaPessoasDiv.innerHTML += `<h2>ID: ${pessoa.id}, Name: ${pessoa.name}</h2>`;
    });
    

   

    
}