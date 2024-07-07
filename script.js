
document.addEventListener('DOMContentLoaded', () => {
    initSortable();
    initEditable();
    loadTemplates();
});

function loadTemplates() {
    const templateFiles = [
        'templates.json',
        'templates2.json',
        'templates3.json',
        'templates4.json',
        'templates6.json',
        'templates9.json'
    ];

    let templates = {};

    Promise.all(templateFiles.map(file => 
        fetch(file)
            .then(response => response.json())
            .catch(error => console.warn(`Error loading ${file}:`, error))
    ))
    .then(dataArray => {
        dataArray.forEach(data => {
            Object.assign(templates, data);
        });
        populateDropdown(templates);
        setupTemplateChangeHandler(templates);
    })
    .catch(error => console.error('Error loading templates:', error));
}

function populateDropdown(templates) {
    const dropdown = document.getElementById('templateDropdown');
    for (const key in templates) {
        if (templates.hasOwnProperty(key)) {
            const option = document.createElement('option');
            option.value = key;
            option.text = key;
            dropdown.add(option);
        }
    }
}

function setupTemplateChangeHandler(templates) {
    const dropdown = document.getElementById('templateDropdown');
    dropdown.addEventListener('change', function() {
        const selectedTemplate = templates[this.value];
        displayTemplate(selectedTemplate);
    });
}

function displayTemplate(template) {
    const formContent = document.getElementById('formContent');
    formContent.innerHTML = ''; // Clear previous content
    if (template) {
        template.forEach(element => {
            formContent.insertAdjacentHTML('beforeend', createFormElement(element));
        });
        initSortable();
        initEditable();
    }
}

function createFormElement(element) {
    let html = `<div class="form-element draggable">`;
    switch (element.type) {
        case 'header':
            html += `<h2 class="editable">${element.text}</h2>`;
            break;
        case 'title':
            html += `<h3 class="editable">${element.text}</h3>`;
            break;
        case 'date':
            html += `<label class="editable">${element.label}</label><input type="date">`;
            break;
        case 'time':
            html += `<label class="editable">${element.label}</label><input type="time">`;
            break;
        case 'number':
            html += `<label class="editable">${element.label}</label><input type="number" min="${element.min}" max="${element.max || ''}">`;
            break;
        case 'textarea':
            html += `<label class="editable">${element.label}</label><textarea placeholder="${element.placeholder}"></textarea>`;
            break;
        case 'rating':
            html += `<label class="editable">${element.label}</label><input type="number" min="1" max="${element.max}">`;
            break;
        case 'checkbox':
            html += `<label class="editable">${element.label}</label><div class="checkbox-group">`;
            element.options.forEach(option => {
                html += `<div class="checkbox-item"><input type="checkbox"><span class="editable">${option}</span></div>`;
            });
            html += `</div>`;
            break;
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

function printForm() {
    document.querySelectorAll('.edit-icon, .edit-options').forEach(el => el.style.display = 'none');
    window.print();
    document.querySelectorAll('.edit-icon, .edit-options').forEach(el => el.style.display = '');
}
