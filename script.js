document.addEventListener('DOMContentLoaded', () => {
    initSortable();
    setupTherapyDropdown();
});

let templates = {};

function setupTherapyDropdown() {
    const therapyDropdown = document.getElementById('therapyDropdown');
    therapyDropdown.addEventListener('change', function() {
        const selectedTherapy = this.value;
        resetTemplateDropdown();
        templates = {}; // Reset the templates object
        filterTemplatesByTherapy(selectedTherapy);
    });
}

function resetTemplateDropdown() {
    const templateDropdown = document.getElementById('templateDropdown');
    templateDropdown.innerHTML = '<option value="">Kies een template</option>';
}

function filterTemplatesByTherapy(therapy) {
    const templateFilesByTherapy = {
        'CGT': ['CGT1.json', 'CGT2.json', 'CGT3.json', 'CGT4.json', 'CGT5.json'],
        'ACT': ['ACT.json'],
        'EFT': ['EFT.json'],
	'DGT': ['DGT.json'],
	'CRISIS': ['CRISIS.json']
    };

    const filesToLoad = templateFilesByTherapy[therapy] || [];
    loadSpecificTemplates(filesToLoad);
}

function loadSpecificTemplates(files) {
    const promises = files.map(file => 
        fetch(file)
            .then(response => response.json())
            .then(data => {
                Object.keys(data).forEach(key => {
                    templates[key] = data[key];
                });
            })
            .catch(error => console.warn(`Error loading ${file}:`, error))
    );

    Promise.all(promises)
    .then(() => {
        populateTemplateDropdown(Object.keys(templates));
    })
    .catch(error => console.error('Error loading templates:', error));
}

function populateTemplateDropdown(templateKeys) {
    const templateDropdown = document.getElementById('templateDropdown');
    templateKeys.forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.text = key;
        templateDropdown.add(option);
    });
    setupTemplateChangeHandler();
}

function setupTemplateChangeHandler() {
    const templateDropdown = document.getElementById('templateDropdown');
    templateDropdown.addEventListener('change', function() {
        const selectedTemplate = templates[this.value];
        displayTemplate(selectedTemplate);
    });
}

function displayTemplate(template) {
    const formContent = document.getElementById('formContent');
    formContent.innerHTML = ''; // Clear previous content
    if (template) {
        template.forEach(element => {
            formContent.insertAdjacentHTML('beforeend', createFormElement(element)); // Voeg aan het einde toe
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
            html += `<label class="editable">Datum</label><input type="text" placeholder="Voer datum in">`;
            break;
        case 'time':
            html += `<label class="editable">Tijd</label><input type="text" placeholder="Voer tijd in">`;
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
            html += `
                <div class="scale-image-container">
                    <label class="editable">${element.label}</label>
                    <img src="Schaal.png" alt="Schaal" class="scale-image">
                </div>`;
            break;
        default:
            break;
    }
    html += `<button class="remove-element">x</button></div>`;
    return html;
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

function addCheckboxItem(button) {
    const checkboxGroup = button.previousElementSibling;
    const newCheckbox = document.createElement('div');
    newCheckbox.className = 'checkbox-item';
    newCheckbox.innerHTML = '<input type="checkbox"><span class="editable">...</span>';
    checkboxGroup.appendChild(newCheckbox);
    
    // Maak de nieuwe checkbox direct bewerkbaar
    const editableSpan = newCheckbox.querySelector('.editable');
    const newText = prompt("Voer de tekst in voor de nieuwe checkbox:");
    if (newText !== null) {
        editableSpan.textContent = newText;
    }

    initEditable(); // Reinitialize to make new elements editable
}

function addTextField() {
    const formContent = document.getElementById('formContent');
    const textFieldElement = createFormElement({
        type: 'text',
        label: 'Tekstveld',
        placeholder: 'Voer tekst in'
    });
    formContent.insertAdjacentHTML('afterbegin', textFieldElement); // Voeg nieuw element bovenaan toe
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
    formContent.insertAdjacentHTML('afterbegin', textareaElement); // Voeg nieuw element bovenaan toe
    initSortable();
    initEditable();
}

function addCheckboxGroup() {
    const formContent = document.getElementById('formContent');
    const checkboxGroupElement = createFormElement({
        type: 'checkbox',
        label: 'Kies',
        options: ['1', '2', '3']
    });
    formContent.insertAdjacentHTML('afterbegin', checkboxGroupElement); // Voeg nieuw element bovenaan toe
    initSortable();
    initEditable();
}

function addHeader() {
    const formContent = document.getElementById('formContent');
    const headerElement = createFormElement({
        type: 'header',
        text: 'Titel',
        class: 'header-element' // Voeg de klasse 'header-element' toe
    });
    formContent.insertAdjacentHTML('afterbegin', headerElement);

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
    formContent.insertAdjacentHTML('afterbegin', ratingScaleElement); // Voeg nieuw element bovenaan toe
    initSortable();
    initEditable();
}

function addScaleImage() {
    const formContent = document.getElementById('formContent');
    const scaleImageElement = createFormElement({
        type: 'scaleImage',
        label: 'Intensiteit'
    });
    formContent.insertAdjacentHTML('afterbegin', scaleImageElement); // Voeg nieuw element bovenaan toe
    initSortable();
    initEditable();
}

function removeCheckboxItem(button) {
    const checkboxGroup = button.previousElementSibling.previousElementSibling;
    if (checkboxGroup.children.length > 0) {
        checkboxGroup.removeChild(checkboxGroup.lastElementChild);
    }
}

function printForm() {
    window.print();
}
