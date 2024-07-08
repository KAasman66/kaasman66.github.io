function addTextField() {
    const element = {
        type: 'textarea',
        label: 'Tekstveld',
        placeholder: 'Voer tekst in'
    };
    addElementToForm(element);
}

function addCheckboxGroup() {
    const element = {
        type: 'checkbox',
        label: 'Afvinkvakjes',
        options: ['Optie 1', 'Optie 2', 'Optie 3']
    };
    addElementToForm(element);
}

// Verwijder de keuzerondjes functie
// function addRadioGroup() {
//     const element = {
//         type: 'radio',
//         label: 'Keuzerondjes',
//         options: ['Optie 1', 'Optie 2', 'Optie 3']
//     };
//     addElementToForm(element);
// }

function addHeader() {
    const element = {
        type: 'header',
        text: 'Titel'
    };
    addElementToForm(element);
}

function addRatingScale() {
    const element = {
        type: 'rating',
        label: 'Schaal',
        max: 100
    };
    addElementToForm(element);
}

function addElementToForm(element) {
    const formContent = document.getElementById('formContent');
    const header = formContent.querySelector('h1');
    if (header) {
        header.insertAdjacentHTML('afterend', createFormElement(element));
    } else {
        formContent.insertAdjacentHTML('afterbegin', createFormElement(element));
    }
    initSortable();
    initEditable();
}

function createFormElement(element) {
    let html = `<div class="form-element draggable">`;
    switch (element.type) {
        case 'header':
            html += `<h2 class="editable">${element.text}</h2>`;
            break;
        case 'textarea':
            html += `<label class="editable">${element.label}</label><textarea placeholder="${element.placeholder}"></textarea>`;
            break;
        case 'checkbox':
            html += `<label class="editable">${element.label}</label><div class="checkbox-group">`;
            element.options.forEach(option => {
                html += `<div class="checkbox-item"><input type="checkbox"><span class="editable">${option}</span></div>`;
            });
            html += `</div>`;
            break;
        case 'rating':
            html += `<label class="editable">${element.label}</label><input type="range" min="0" max="${element.max}" value="0">`;
            break;
        default:
            break;
    }
    html += `<span class="edit-icon">✏️</span></div>`;
    return html;
}

function printForm() {
    window.print();
}

function initSortable() {
    new Sortable(document.getElementById('formContent'), {
        animation: 150,
        ghostClass: 'blue-background-class'
    });
}

function initEditable() {
    document.querySelectorAll('.edit-icon').forEach(el => {
        el.addEventListener('click', function(e) {
            e.stopPropagation();
            document.querySelectorAll('.edit-options').forEach(opt => opt.remove());
            
            const formElement = this.closest('.form-element');
            const options = document.createElement('div');
            options.className = 'edit-options';
            options.innerHTML = 
                `<button onclick="editElementText(this)">Tekst aanpassen</button>
                <button onclick="removeElement(this)">Verwijderen</button>`;
            formElement.appendChild(options);
            options.style.display = 'block';
        });
    });

    document.querySelectorAll('.editable').forEach(el => {
        el.addEventListener('dblclick', function() {
            const newText = prompt("Pas de tekst aan:", this.textContent);
            if (newText !== null) {
                this.textContent = newText;
            }
        });
    });
}

function editElementText(button) {
    const formElement = button.closest('.form-element');
    const editableElements = formElement.querySelectorAll('.editable');
    editableElements.forEach(el => {
        const newText = prompt("Pas de tekst aan:", el.textContent);
        if (newText !== null) {
            el.textContent = newText;
        }
    });
    button.parentElement.remove();
}

function removeElement(button) {
    button.closest('.form-element').remove();
}
