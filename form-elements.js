function createFormElement(element) {
    let html = `<div class="form-element draggable">`;
    switch (element.type) {
        case 'header':
            html += `<h2 class="editable">${element.text}</h2>`;
            break;
        case 'paragraph':
            html += `<p class="editable">${element.text}</p>`;
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
        case 'radio':
            html += `<label class="editable">${element.label}</label><div class="radio-group">`;
            element.options.forEach(option => {
                html += `<div class="radio-item"><input type="radio" name="${element.label}"><span class="editable">${option}</span></div>`;
            });
            html += `</div>`;
            break;
        case 'date':
            html += `<label class="editable">${element.label}</label><input type="date">`;
            break;
        case 'rating':
            html += `<label class="editable">${element.label}</label><div class="rating-group">`;
            for (let i = 1; i <= element.max; i++) {
                html += `<input type="radio" name="${element.label}" value="${i}">${i}`;
            }
            html += `</div>`;
            break;
        case 'number':
            html += `<label class="editable">${element.label}</label><input type="number" min="${element.min}" max="${element.max}">`;
            break;
        default:
            break;
    }
    html += `<span class="edit-icon">✏️</span></div>`;
    return html;
}

function addTextField() {
    const fieldName = prompt("Geef een naam voor het tekstveld:");
    if (fieldName) {
        const placeholder = prompt("Geef een placeholder tekst (optioneel):");
        const element = { type: 'textarea', label: fieldName, placeholder: placeholder || '' };
        document.getElementById('formContent').insertAdjacentHTML('beforeend', createFormElement(element));
        initSortable();
        initEditable();
    }
}

function addCheckboxGroup() {
    const groupName = prompt("Geef een naam voor de groep afvinkvakjes:");
    if (groupName) {
        const options = [];
        while (true) {
            const option = prompt(`Geef optie ${options.length + 1} (of laat leeg om te stoppen):`);
            if (!option) break;
            options.push(option);
        }
        const element = { type: 'checkbox', label: groupName, options: options };
        document.getElementById('formContent').insertAdjacentHTML('beforeend', createFormElement(element));
        initSortable();
        initEditable();
    }
}

function addRadioGroup() {
    const groupName = prompt("Geef een naam voor de groep keuzerondjes:");
    if (groupName) {
        const options = [];
        while (true) {
            const option = prompt(`Geef optie ${options.length + 1} (of laat leeg om te stoppen):`);
            if (!option) break;
            options.push(option);
        }
        const element = { type: 'radio', label: groupName, options: options };
        document.getElementById('formContent').insertAdjacentHTML('beforeend', createFormElement(element));
        initSortable();
        initEditable();
    }
}

function addDateField() {
    const fieldName = prompt("Geef een naam voor het datumveld:");
    if (fieldName) {
        const element = { type: 'date', label: fieldName };
        document.getElementById('formContent').insertAdjacentHTML('beforeend', createFormElement(element));
        initSortable();
        initEditable();
    }
}

function addRatingScale() {
    const fieldName = prompt("Geef een naam voor de beoordelingsschaal:");
    if (fieldName) {
        const max = prompt("Geef het maximum aantal punten voor de schaal:");
        const element = { type: 'rating', label: fieldName, max: parseInt(max) || 5 };
        document.getElementById('formContent').insertAdjacentHTML('beforeend', createFormElement(element));
        initSortable();
        initEditable();
    }
}

function addHeader() {
    const text = prompt("Geef de tekst voor de koptekst:");
    if (text) {
        const element = { type: 'header', text: text };
        document.getElementById('formContent').insertAdjacentHTML('beforeend', createFormElement(element));
        initSortable();
        initEditable();
    }
}

function addParagraph() {
    const text = prompt("Geef de tekst voor de paragraaf:");
    if (text) {
        const element = { type: 'paragraph', text: text };
        document.getElementById('formContent').insertAdjacentHTML('beforeend', createFormElement(element));
        initSortable();
        initEditable();
    }
}

function addNumberField() {
    const fieldName = prompt("Geef een naam voor het numerieke veld:");
    if (fieldName) {
        const min = prompt("Geef het minimum aantal (optioneel):");
        const max = prompt("Geef het maximum aantal (optioneel):");
        const element = { type: 'number', label: fieldName, min: min || '', max: max || '' };
        document.getElementById('formContent').insertAdjacentHTML('beforeend', createFormElement(element));
        initSortable();
        initEditable();
    }
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
