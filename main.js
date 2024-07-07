document.addEventListener('DOMContentLoaded', () => {
    loadExternalTemplates();
    initSortable();
    initEditable();
});

document.getElementById('templateSelect').addEventListener('change', function() {
    const templateName = this.value;
    const formContent = document.getElementById('formContent');
    formContent.innerHTML = '';
    if (templateName && templates[templateName]) {
        templates[templateName].forEach(element => {
            formContent.insertAdjacentHTML('beforeend', createFormElement(element));
        });
        initSortable();
        initEditable();
    }
});
