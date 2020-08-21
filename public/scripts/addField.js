document.querySelector('#add-time')
.addEventListener('click', checkIfEmpty)

function checkIfEmpty () {
    const selectField = document.querySelector('#schedule-items').querySelectorAll('select')
    const fieldss = document.querySelector('#schedule-items').querySelectorAll('input')
    var i;
    var campoInvalido = 0;
    //verifica se há algum campo vazio no select
    for (i = 0; i < selectField.length; i++) {
        if (selectField[i].value == "") {
            campoInvalido += 1
        }
    }
    //verifica se há algum campo vazio nos inputs
    for (i = 0; i < fieldss.length; i++) {
        if (fieldss[i].value == "") {
            campoInvalido += 1
        }
    }
    //se tudo estiver preenchido, executa a função de duplicar
    if (campoInvalido == 0) {
        cloneField()
    }
}

function cloneField() {
    //duplica os campos
    const newFieldContainer = document.querySelector('.schedule-item').cloneNode(true) /*Node é usado para se referir a um elemento HTML. cloneNode retorna a cópia de um elemento html. Se o valor entre () for true, ele retorna também os descendentes deste elemento.*/
    //limpa os valores dos campos duplicados
    const fields = newFieldContainer.querySelectorAll('input') 
    fields.forEach(function(field) {
        field.value = ""
    })
    //cria o botão excluir
    //const deleteButton = document.createElement('img')
    //deleteButton.src = '/images/icons/delete-item-icon.svg'
    const deleteButton = document.createElement('button')
    deleteButton.innerHTML = "Excluir"
    deleteButton.className = "removeItem"
    deleteButton.onclick = removeField
    //coloca os elementos na página
    document.querySelector('#schedule-items').appendChild(newFieldContainer)
    newFieldContainer.appendChild(deleteButton)
}

function removeField () {
    //remove o elemento pai do botão
    var div = this.parentNode;
    div.parentNode.removeChild(div);
}

var timeFrom = document.querySelector('#time_from')


timeFrom.addEventListener('focusout', hello)

function hello () {
    var timeTo = document.querySelector('#time_to')
    timeTo.min = timeFrom.value
}