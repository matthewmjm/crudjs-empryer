console.log('%cJavaScript is connected!', 'color: green')

document.addEventListener('DOMContentLoaded', ()=>{
    baseURL = 'http://bagel-api-fis.herokuapp.com/bagels'
    
    fetch(baseURL)
        .then(response => response.json())
        .then(result => handleBagels(result))

    function handleBagels(bagels){
        return bagels.forEach(bagel => renderBagel(bagel.type))
    }

    const bagelsList = document.querySelector('#bagel-ul')

    function renderBagel(bagel) {
        const li = document.createElement('li')
        li.innerText = bagel
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

    function handleUpdateForm(event) {
        event.preventDefault()
        console.log(event.target.children[0].value)
        renderBagel(event.target.children[0].value)
        event.target.parentNode.remove()

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