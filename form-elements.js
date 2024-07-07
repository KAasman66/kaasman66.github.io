
function addDropdown() {
    const label = prompt("Geef een label voor het dropdown menu:");
    if (label) {
        const element = {
            type: 'dropdown',
            label: label,
            options: ['A', 'B']
        };
        document.getElementById('formContent').insertAdjacentHTML('beforeend', createFormElement(element));
        initSortable();
        initEditable();
    }
}

function createFormElement(element) {
    let html = `<div class="form-element draggable">`;
    switch (element.type) {
        // ... andere cases ...
        case 'dropdown':
            html += `<label class="editable">${element.label}</label><select>`;
            element.options.forEach(option => {
                html += `<option value="${option}">${option}</option>`;
            });
            html += `</select>`;
            break;
        default:
            break;
    }
    html += `<span class="edit-icon">✏️</span></div>`;
    return html;
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
