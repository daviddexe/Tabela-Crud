'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')
// após fechar ou cadastrar os dados são limpos
const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')

}


const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? []
const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient))


//DELETE
const deleteCliente = (index) => {
    const dbClient = readClient()
    dbClient.splice(index, 1)
    setLocalStorage(dbClient)
    updateTable()
}



// UPDATE
const updateClient = (index, client) => {
    const dbClient = readClient()
    dbClient[index] = client
    setLocalStorage(dbClient)
}
//READ
const readClient = () => getLocalStorage()

//CREATE
const createClient = (client) => {
    const dbClient = getLocalStorage()
    dbClient.push(client)
    setLocalStorage(dbClient)

}

//validação de dados
const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}
//interação com layout

//limpar campos após cadastro // fechar modal
const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = '')
}
const saveClient = () => {
    if (isValidFields()) {
        const client = {
            nome: document.getElementById('nome').value,
            cpf: document.getElementById('cpf').value,
            genero: document.getElementById('genero').value,
            endereço: document.getElementById('endereço').value,
            observaçao: document.getElementById('observaçao').value,

        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new'){
        createClient(client)
        updateTable()
        closeModal()
        }else{
            updateClient(index, client)
            updateTable()
            closeModal()
        } 

    }
}
const createRow = (client, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.cpf}</td>
        <td>${client.genero}</td>
        <td>${client.endereço}</td>
        <td>${client.observaçao}</td>
        <td>
            <button type="button" class="green" data-action="edit-${index}">Editar</button>
            <button type="button" class="red" data-action="delete-${index}">Excluir</button>
        </td>
    `
    document.querySelector('#tableClient > tbody').appendChild(newRow)
}
// não duplicar no update
const clearTable = () => {
    const rows = document.querySelectorAll('tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}
const updateTable = () => {
    const dbClient = readClient()
    clearTable()
    dbClient.forEach(createRow)
}
const fillFields = (client) => {
document.getElementById('nome').value =  client.nome
document.getElementById('cpf').value =  client.cpf
document.getElementById('genero').value =  client.genero
document.getElementById('endereço').value =  client.endreço
document.getElementById('observaçao').value =  client.observaçoes
document.getElementById('nome').dataset.index =  client.index


}

const editClient = (index) => {
    const client = readClient()[index]
    client.index = index
    fillFields(client)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {
        const [action, index] = event.target.dataset.action.split('-')
        if (action =='edit'){
            editClient(index)
        } else {
                const client = readClient()[index]
                const response = confirm(`Deseja realmente excluir o cliente ${client.nome}`)
                if(response){
                    updateTable()
                    deleteCliente(index)
                }
            }
        }
    }

updateTable()

//eventos 

document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

document.getElementById('fecharModal')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveClient)

document.querySelector('#tableClient > tbody')
    .addEventListener('click', editDelete)