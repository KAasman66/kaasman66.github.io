let templates = {};

function loadExternalTemplates() {
    const templateFiles = [
        'templates.json',
        'templates1.json',
        'templates2.json',
        'templates3.json',
        'templates4.json',
        'templates5.json',
        'templates6.json',
        'templates7.json',
        'templates8.json',
        'templates9.json',
        'templates10.json',
        'templates11.json',
        'templates12.json',
        'templates13.json',
        'templates14.json',
        'templates15.json',
        'templates16.json',
        'templates17.json',
        'templates18.json',
        'templates19.json',
        'templates20.json',
        'templates21.json',
        'templates22.json',
        'templates23.json',
        'templates24.json'
    ];

    Promise.all(templateFiles.map(file => fetch(file).then(response => response.ok ? response.json() : {}).catch(() => {})))
        .then(dataArray => {
            dataArray.forEach(data => {
                if (data) {
                    templates = { ...templates, ...data };
                }
            });
            updateTemplateSelect();
        })
        .catch(error => console.error('Error loading templates:', error));
}

function updateTemplateSelect() {
    const select = document.getElementById('templateSelect');
    select.innerHTML = '<option value="">Selecteer een template</option>';
    for (const [key, value] of Object.entries(templates)) {
        select.innerHTML += `<option value="${key}">${value[0].text}</option>`;
    }
}
