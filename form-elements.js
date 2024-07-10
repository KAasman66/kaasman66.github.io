function addTextField() {
    const formContent = document.getElementById('formContent');
    const textFieldElement = createFormElement({
        type: 'text',
        label: 'Tekstveld',
        placeholder: 'Voer tekst in'
    });
    formContent.insertAdjacentHTML('beforeend', textFieldElement);
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
    formContent.insertAdjacentHTML('beforeend', checkboxGroupElement);
    initSortable();
    initEditable();
}

function addHeader() {
    const formContent = document.getElementById('formContent');
    const headerElement = createFormElement({
        type: 'header',
        text: 'Koptekst'
    });
    formContent.insertAdjacentHTML('beforeend', headerElement);
    initSortable();
    initEditable();
}

function addRatingScale() {
    const formContent = document.getElementById('formContent');
    const ratingScaleElement = createFormElement({
        type: 'rating-scale',
        label: 'Schaal'
    });
    formContent.insertAdjacentHTML('beforeend', ratingScaleElement);
    initSortable();
    initEditable();
}

function addCheckboxGroup3() {
    const formContent = document.getElementById('formContent');
    const checkboxGroupElement = createFormElement({
        type: 'checkbox-group',
        label: 'Keuze',
        options: ['Optie 1', 'Optie 2', 'Optie 3']
    });
    formContent.insertAdjacentHTML('beforeend', checkboxGroupElement);
    initSortable();
    initEditable();
}
