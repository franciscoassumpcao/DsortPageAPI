let persons = []
const endpointDaAPI = 'https://dsortapi-apim.azure-api.net/api/Person/getAllPerson';

getBuscarTodosDocumentosDaAPI();
const listaPessoasDiv = document.getElementById('listaPessoas');
const TablePessoas = document.getElementById('tableListaPessoas');

async function getBuscarTodosDocumentosDaAPI(){
    const conexaoAllPerson = await fetch(endpointDaAPI)
    persons = await conexaoAllPerson.json();    
    
    persons.forEach(pessoa => {
        //listaPessoasDiv.innerHTML += `<h2>ID: ${pessoa.id}, Name: ${pessoa.name}</h2>`;
        TablePessoas.innerHTML += `
        <tr>
        <td>${pessoa.id}</td>
        <td>${pessoa.name}</td>
        <td>0</td>
        </tr>
        `
    }); 
}