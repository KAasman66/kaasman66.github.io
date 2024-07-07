// Controleer eerst of templates al is gedeclareerd
var templates = templates || {};

function loadExternalTemplates() {
    const templateFiles = [
        'templates.json',
        // Voeg hier alle andere templatebestanden toe
    ];

    Promise.all(templateFiles.map(file => 
        fetch(file)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .catch(error => {
                console.warn(`Failed to load ${file}:`, error);
                return null;
            })
    ))
        .then(dataArray => {
            dataArray.forEach(data => {
                if (data) {
                    templates = { ...templates, ...data };
                }
            });
            console.log('Loaded templates:', templates);
            updateTemplateSelect();
        })
        .catch(error => console.error('Error loading templates:', error));
}

function updateTemplateSelect() {
    const select = document.getElementById('templateSelect');
    select.innerHTML = '<option value="">Selecteer een template</option>';
    for (const [key, value] of Object.entries(templates)) {
        if (value && value.length > 0 && value[0].text) {
            select.innerHTML += `<option value="${key}">${value[0].text}</option>`;
        } else {
            console.warn(`Invalid template data for key: ${key}`);
        }
    }

    if (select.options.length === 1) {
        console.warn('No valid templates were loaded into the select element.');
    }
}

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
