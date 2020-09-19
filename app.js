console.log('%cJavaScript is connected!', 'color: green')

document.addEventListener('DOMContentLoaded', ()=>{
    baseURL = 'http://bagel-api-fis.herokuapp.com/bagels'
    
    
// --------------------------------------------------------------------------------- 
// READ  
    // Render all bagels from API call to backend
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
        createDeleteButton(li)
        bagelsList.appendChild(li)
    }
 // ---------------------------------------------------------------------------------   





// ---------------------------------------------------------------------------------
// CREATE
    // create form for user to input a new bagel
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
// ---------------------------------------------------------------------------------    





// ---------------------------------------------------------------------------------
// UPDATE
    // Create Update Button
    function createUpdateButton(li) {
        const updateButton = document.createElement('button')
        updateButton.innerText = 'Update Ye Bagel'
        updateButton.className = "update-button"
        updateButton.addEventListener('click', (event) => {
            bagelUpdate(event)
        })
        li.append(updateButton)
    }

    // Create Update Form   
    function bagelUpdate(event) {
        console.log(event.target.parentNode) 
        event.target.parentNode.innerHTML = `
        <form id="update-form">
        <input type='text' value='${event.target.parentNode.innerText.slice(0,-30)}'> 
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
        const idOfUpdatedBagel = event.target.parentNode.id
        console.log(updatedBagel)
        renderBagel(updatedBagel)
        event.target.parentNode.remove()
        
        // persist
        console.log(event.target.parentNode)
        persistBagelUpdate(idOfUpdatedBagel, updatedBagel) 
        console.log("id: ", idOfUpdatedBagel)
        console.log("updated Bagel: ", updatedBagel)
        
    }

    // After Updating DOM, update back-end with updated li
    function persistBagelUpdate(idOfUpdatedBagel, updatedBagel) {
        fetch(`http://bagel-api-fis.herokuapp.com/bagels/${idOfUpdatedBagel}`, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({type:updatedBagel})
            
        })
    }
// ---------------------------------------------------------------------------------    





// ---------------------------------------------------------------------------------
// DELETE
    // Create Delete Button
    function createDeleteButton(li) {
        const deleteButton = document.createElement('button')
        deleteButton.innerText = "Delete Ye Bagel"
        deleteButton.className = "delete-button"
        li.append(deleteButton)
        deleteButton.addEventListener('click', (event) => {
            let deleteId = event.target.parentNode.id
            event.target.parentNode.remove()
            bagelDelete(deleteId)
        })
    }

    function bagelDelete(deleteId) {
        fetch(`http://bagel-api-fis.herokuapp.com/bagels/${deleteId}`, {
            method: "DELETE"
        })
    }
// ---------------------------------------------------------------------------------


})