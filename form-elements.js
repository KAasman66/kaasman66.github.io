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

function addCheckboxGroup() {
    const formContent = document.getElementById('formContent');
    const checkboxGroupElement = createFormElement({
        type: 'checkbox',
        label: 'Afvinkvakjes',
        options: ['Optie 1', 'Optie 2', 'Optie 3']
    });
    formContent.insertAdjacentHTML('afterbegin', checkboxGroupElement); // Voeg nieuw element bovenaan toe
    initSortable();
    initEditable();
}

function addHeader() {
    const formContent = document.getElementById('formContent');
    const headerElement = createFormElement({
        type: 'header',
        text: 'Koptekst'
    });
    formContent.insertAdjacentHTML('afterbegin', headerElement); // Voeg nieuw element bovenaan toe
    initSortable();
    initEditable();
}

function addRatingScale() {
    const formContent = document.getElementById('formContent');
    const ratingScaleElement = createFormElement({
        type: 'rating-scale',
        label: 'Schaal'
    });
    formContent.insertAdjacentHTML('afterbegin', ratingScaleElement); // Voeg nieuw element bovenaan toe
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

function addScaleImage() {
    const formContent = document.getElementById('formContent');
    const scaleImageElement = createFormElement({
        type: 'scaleImage',
        label: 'Schaal Afbeelding'
    });
    formContent.insertAdjacentHTML('afterbegin', scaleImageElement); // Voeg nieuw element bovenaan toe
    initSortable();
    initEditable();
}

