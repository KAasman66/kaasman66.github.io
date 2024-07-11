document.addEventListener('DOMContentLoaded', () => {
    initSortable();
    loadTemplates();
});

function loadTemplates() {
    const templateFiles = [
        'templates.json',
        'templates2.json',
        'templates3.json',
        'templates4.json',
        'templates6.json',
        'templates7.json',
        'templates8.json',
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
            formContent.insertAdjacentHTML('afterbegin', createFormElement(element));
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
            html += `</div><button class="add-checkbox" onclick="addCheckboxItem(this)">+</button><button class="remove-checkbox" onclick="removeCheckboxItem(this)">-</button>`;
            break;
        case 'dropdown':
            html += `<label class="editable">${element.label}</label><select>`;
            element.options.forEach(option => {
                html += `<option value="${option}">${option}</option>`;
            });
            html += `</select>`;
            break;
        case 'text':
            html += `<label class="editable">${element.label}</label><input type="text" placeholder="${element.placeholder || ''}">`;
            break;
        case 'scaleImage':
            html += `<label class="editable">${element.label}</label><img src="Schaal.png" alt="Schaal" class="scale-image">`;
            break;
        default:
            break;
    }
    html += `<button class="remove-element">x</button></div>`;
    return html;
}

function addTextarea() {
    const formContent = document.getElementById('formContent');
    const textareaElement = createFormElement({
        type: 'textarea',
        label: 'Tekstgebied',
        placeholder: 'Voer tekst in'
    });
    formContent.insertAdjacentHTML('afterbegin', textareaElement); // Voeg aan het begin toe
    initSortable();
    initEditable();
}


function initSortable() {
    new Sortable(document.getElementById('formContent'), {
        animation: 150,
        ghostClass: 'blue-background-class'
    });
}

function initEditable() {
    document.querySelectorAll('.editable').forEach(el => {
        el.addEventListener('click', function() {
            const newText = prompt("Pas de tekst aan:", this.textContent);
            if (newText !== null) {
                this.textContent = newText;
            }
        });
    });

    document.querySelectorAll('.remove-element').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.form-element').remove();
        });
    });
}

function addTextField() {
    const formContent = document.getElementById('formContent');
    const textFieldElement = createFormElement({
        type: 'text',
        label: 'Tekstveld',
        placeholder: 'Voer tekst in'
    });
    formContent.insertAdjacentHTML('afterbegin', textFieldElement); // Voeg aan het begin toe
    initSortable();
    initEditable();
}

function addTextarea() {
    const formContent = document.getElementById('formContent');
    const textareaElement = createFormElement({
        type: 'textarea',
        label: 'Tekstgebied',
        placeholder: 'Voer tekst in'
    });
    formContent.insertAdjacentHTML('afterbegin', textareaElement); // Voeg aan het begin toe
    initSortable();
    initEditable();
}

function addCheckboxGroup() {
    const formContent = document.getElementById('formContent');
    const checkboxGroupElement = createFormElement({
        type: 'checkbox',
        label: 'Afvinkvakjes',
        options: ['Optie 1', 'Optie 2', 'Optie 3']
    });
    formContent.insertAdjacentHTML('afterbegin', checkboxGroupElement); // Voeg aan het begin toe
    initSortable();
    initEditable();
}

function addHeader() {
    const formContent = document.getElementById('formContent');
    const headerElement = createFormElement({
        type: 'header',
        text: 'Koptekst'
    });
    formContent.insertAdjacentHTML('afterbegin', headerElement); // Voeg aan het begin toe
    initSortable();
    initEditable();
}

function addRatingScale() {
    const formContent = document.getElementById('formContent');
    const ratingScaleElement = createFormElement({
        type: 'rating',
        label: 'Schaal',
        max: 10
    });
    formContent.insertAdjacentHTML('afterbegin', ratingScaleElement); // Voeg aan het begin toe
    initSortable();
    initEditable();
}

function addCheckboxGroup3() {
    const formContent = document.getElementById('formContent');
    const checkboxGroupElement = createFormElement({
        type: 'checkbox',
        label: 'Keuze',
        options: ['Optie A', 'Optie B', 'Optie C']
    });
    formContent.insertAdjacentHTML('afterbegin', checkboxGroupElement); // Voeg aan het begin toe
    initSortable();
    initEditable();
}

function addCheckboxItem(button) {
    const checkboxGroup = button.previousElementSibling;
    const newCheckbox = document.createElement('div');
    newCheckbox.className = 'checkbox-item';
    newCheckbox.innerHTML = '<input type="checkbox"><span class="editable">Nieuwe optie</span>';
    checkboxGroup.appendChild(newCheckbox);
    initEditable(); // Reinitialize to make new elements editable
}

function removeCheckboxItem(button) {
    const checkboxGroup = button.previousElementSibling.previousElementSibling;
    if (checkboxGroup.children.length > 0) {
        checkboxGroup.removeChild(checkboxGroup.lastElementChild);
    }
}

function addScaleImage() {
    const formContent = document.getElementById('formContent');
    const scaleImageElement = createFormElement({
        type: 'scaleImage',
        label: 'Schaal Afbeelding'
    });
    formContent.insertAdjacentHTML('afterbegin', scaleImageElement); // Voeg aan het begin toe
    initSortable();
    initEditable();
}

function printForm() {
    window.print();
}
