console.log('%cJavaScript is connected!', 'color: green')

document.addEventListener('DOMContentLoaded', ()=>{
    baseURL = 'http://bagel-api-fis.herokuapp.com/bagels'
    
    fetch(baseURL)
        .then(response => response.json())
        .then(result => handleBagels(result))

    function handleBagels(bagels){
        return bagels.forEach(bagel => renderBagel(bagel.type, bagel.id))
    }

    const bagelsList = document.querySelector('#bagel-ul')

    function renderBagel(bagel, id) {
        const li = document.createElement('li')
        li.innerText = bagel
        li.id = id
        createUpdateButton(li)
        bagelsList.appendChild(li)
    }

    //CREATE BUTTON
    function createUpdateButton(li) {
        const updateButton = document.createElement('button')
        updateButton.innerText = 'Update Ye Bagel'
        updateButton.addEventListener('click', (event) => {
            bagelUpdate(event)
        })
        li.append(updateButton)
    }

    // UPDATE
    function bagelUpdate(event) {
        console.log(event.target.parentNode) 
        event.target.parentNode.innerHTML = `
            <form id="update-form">
            <input type='text' value='${event.target.parentNode.innerText.slice(0,-15)}'> 
            </form>
        `
        const updateForm = document.querySelector('#update-form')
        updateForm.addEventListener('submit', (event => {
            event.preventDefault()
            handleUpdateForm(event)
        }))
    }

    // After Updating Form, renders on page and removes the original li
    function handleUpdateForm(event) {
        event.preventDefault()
        const updatedBagel = event.target.children[0].value
        console.log(updatedBagel)
        renderBagel(updatedBagel)
        event.target.parentNode.remove()

        // persist
        console.log(event.target.parentNode)
        persistBagelUpdate(event.target.parentNode.id, updatedBagel) 
        console.log("id: ", event.target.parentNode.id)
        console.log("updated Bagel: ", updatedBagel)

    }

    function persistBagelUpdate(id, updatedBagel) {
        fetch(`http://bagel-api-fis.herokuapp.com/bagels/${id}`, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({type:updatedBagel})

        })
    }

    // ADD FORM
    const bagelForm = document.querySelector('#bagel-form')

    bagelForm.addEventListener('submit', (event)=> {
        captureFormInput(event)
    })
// OPTIMISTICALLY RENDER
    function captureFormInput(event) {
        event.preventDefault()
        const formData = new FormData(bagelForm)
        console.log(...formData)
        const newBagel = formData.get('bagel')
        renderBagel(newBagel)
        persistBagel(newBagel)
    }
// options object (required for all but GET: aka  fetch, with options) <- this is the second argument
    function persistBagel(bagel) {
    fetch('http://bagel-api-fis.herokuapp.com/bagels', {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({type:bagel, rating:4})
        })
    }
})