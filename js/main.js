let persons = []
const endpointDaAPI = 'https://dsortapi-apim.azure-api.net/api/Person/getAllPerson';

getBuscarTodosDocumentosDaAPI();


async function getBuscarTodosDocumentosDaAPI(){
    const conexaoAllPerson = await fetch(endpointDaAPI)
    persons = await conexaoAllPerson.json();
    console.log(persons);
    
    

   

    
}