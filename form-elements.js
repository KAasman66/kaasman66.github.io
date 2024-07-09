function addTextField() {
    addElementToForm({
        type: 'text',
        label: 'Tekstveld',
        placeholder: 'Voer tekst in'
    });
}

function addCheckboxGroup(count) {
    const options = Array.from({length: count}, (_, i) => `Optie ${i + 1}`);
    addElementToForm({
        type: 'checkbox',
        label: `${count} keuze opties`,
        options: options
    });
}

function addCheckboxGroup3() { addCheckboxGroup(3); }
function addCheckboxGroup4() { addCheckboxGroup(4); }
function addCheckboxGroup5() { addCheckboxGroup(5); }
function addCheckboxGroup7() { addCheckboxGroup(7); }
function addCheckboxGroup10() { addCheckboxGroup(10); }

function addHeader() {
    addElementToForm({
        type: 'header',
        text: 'Nieuwe Koptekst'
    });
}

function addRatingScale() {
    addElementToForm({
        type: 'rating',
        label: 'Beoordeling',
        min: 1,
        max: 5
    });
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
    initResizable();
}

function createFormElement(element) {
    let html = '';
    switch(element.type) {
        case 'text':
            html = `
                <div class="form-element draggable" draggable="true">
                    <span class="edit-icon">✏️</span>
                    <label class="editable">${element.label}</label>
                    <input type="text" placeholder="${element.placeholder}">
                </div>`;
            break;
        case 'checkbox':
            const options = element.options.map((option, index) => `
                <div class="checkbox-item">
                    <input type="checkbox" id="option${index}" name="option${index}">
                    <span class="editable">${option}</span>
                </div>`).join('');
            html = `
                <div class="form-element draggable" draggable="true">
                    <span class="edit-icon">✏️</span>
                    <label class="editable">${element.label}</label>
                    <div class="checkbox-group">
                        ${options}
                    </div>
                </div>`;
            break;
        case 'header':
            html = `
                <div class="form-element draggable" draggable="true">
                    <span class="edit-icon">✏️</span>
                    <h2 class="editable">${element.text}</h2>
                </div>`;
            break;
        case 'rating':
            const scaleOptions = Array.from({length: element.max - element.min + 1}, (_, i) => `
                <input type="radio" id="rating${i + element.min}" name="rating" value="${i + element.min}">
                <label for="rating${i + element.min}">${i + element.min}</label>
            `).join('');
            html = `
                <div class="form-element draggable" draggable="true">
                    <span class="edit-icon">✏️</span>
                    <label class="editable">${element.label}</label>
                    <div class="rating-scale">
                        ${scaleOptions}
                    </div>
                </div>`;
            break;
    }
    return html;
}

function initSortable() {
    new Sortable(document.getElementById('formContent'), {
        animation: 150,
        ghostClass: 'blue-background-class'
    });
}

function initResizable() {
    // Implementation for making elements resizable
    // This function needs to be defined or removed if not used
}

function printForm() {
    window.print();
}
