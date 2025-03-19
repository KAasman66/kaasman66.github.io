document.addEventListener('DOMContentLoaded', () => {
    // Add mobile viewport meta tag if not present
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
        viewportMeta = document.createElement('meta');
        viewportMeta.name = 'viewport';
        viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0';
        document.head.appendChild(viewportMeta);
    }
    
    // Add mobile-specific styles
    const mobileStyle = document.createElement('style');
    mobileStyle.textContent = `
        @media (max-width: 768px) {
            body {
                padding: 5px;
                margin: 0;
            }
            
            .container {
                padding: 15px;
                margin: 10px;
                width: auto;
                max-width: 100%;
            }
            
            #formContainer {
                width: 100%;
                padding: 10px;
                margin: 0;
            }
            
            .control-group {
                flex-direction: column;
            }
            
            .dropdown-container {
                width: 100%;
            }
            
            select, input, textarea {
                width: 100%;
                padding: 12px;
                font-size: 16px; /* Prevent iOS zoom on focus */
            }
            
            button {
                width: 100%;
                margin: 5px 0;
                padding: 12px;
            }
            
            .print-button-container {
                flex-direction: column;
            }
            
            .float-buttons {
                bottom: 10px;
                right: 10px;
            }
            
            h1 {
                font-size: 24px;
            }
            
            .form-element {
                padding: 10px;
            }
            
            .checkbox-item, .radio-item {
                width: 100%;
            }
        }
    `;
    document.head.appendChild(mobileStyle);
    
    initSortable();
    setupTherapyDropdown();
    
    // Handle the empty form message visibility
    updateEmptyFormMessage();
    
    // Auto-select CGT to immediately show templates
    const therapyDropdown = document.getElementById('therapyDropdown');
    therapyDropdown.value = 'CGT';
    // Trigger change event to load templates
    therapyDropdown.dispatchEvent(new Event('change'));
    
    // Initialize undo/redo
    saveState();
    updateUndoRedoButtons();
    
    // Add event listeners for undo/redo buttons
    const undoButton = document.getElementById('undoButton');
    const redoButton = document.getElementById('redoButton');
    const resetButton = document.getElementById('resetButton');
    
    if (undoButton) {
        undoButton.addEventListener('click', undo);
    }
    
    if (redoButton) {
        redoButton.addEventListener('click', redo);
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', resetForm);
    }
    
    // Initialize scale image components and add marker styles
    addScaleMarkerStyles();
    initializeScaleImageComponents();
    
    // Setup dynamic placeholders
    setupPlaceholders();
    setupDynamicPlaceholders();
    
    // Setup comprehensive event tracking
    attachEventListenersForStateTracking();
    
    // Check for shared form
    checkForSharedForm();
    
    // Add share button to the UI
    const printButtonContainer = document.querySelector('.print-button-container');
    if (printButtonContainer) {
        const shareButton = document.createElement('button');
        shareButton.className = 'share-button';
        shareButton.innerHTML = '<i class="fas fa-share-alt"></i> Delen';
        shareButton.onclick = shareForm;
        shareButton.style.marginLeft = '10px';
        shareButton.style.backgroundColor = '#4CAF50';
        
        printButtonContainer.appendChild(shareButton);
    }
    
    // Add mobile responsive CSS
    const responsiveStyle = document.createElement('style');
    responsiveStyle.innerHTML = `
        @media (max-width: 768px) {
            body {
                padding: 5px;
            }
            
            .container {
                padding: 10px;
                margin: 10px auto;
                max-width: 100%;
            }
            
            #formContainer {
                width: 100%;
                min-height: auto;
                padding: 10px;
                margin: 10px 0;
            }
            
            .control-group, .element-buttons {
                flex-direction: column;
                gap: 10px;
            }
            
            .control-group .dropdown-container {
                width: 100%;
            }
            
            .checkbox-item, .radio-item {
                width: 100%;
            }
            
            .float-buttons {
                bottom: 65px;
                left: 10px;
            }
            
            .float-button {
                width: 45px;
                height: 45px;
                font-size: 16px;
            }
            
            h1 {
                font-size: 1.8rem;
                margin-bottom: 20px;
            }
            
            .print-button-container {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                justify-content: center;
            }
            
            .print-button, .share-button {
                width: 100%;
                margin: 5px 0;
            }
            
            .form-element {
                padding: 15px;
                margin: 10px 0;
            }
            
            #notification-container {
                max-width: 90%;
                top: 10px;
                right: 10px;
            }
            
            .notification {
                font-size: 12px;
                padding: 10px;
            }
            
            .modal-container {
                width: 95%;
                max-width: 95%;
                padding: 15px;
            }
        }
    `;
    document.head.appendChild(responsiveStyle);
    
    // Fix print styling
    const printStyle = document.createElement('style');
    printStyle.innerHTML = `
        @media print {
            body * {
                visibility: hidden;
                background: white !important;
            }
            
            #formContent, #formContent * {
                visibility: visible;
            }
            
            #formContainer {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                padding: 15mm;
                box-shadow: none;
                border: none;
                margin: 0;
            }
            
            .form-element {
                page-break-inside: avoid;
                border: none;
                box-shadow: none;
                background: none !important;
                padding: 5mm 0;
                margin-bottom: 5mm;
            }
            
            .remove-element, .add-checkbox, .remove-checkbox, .edit-icon, .edit-options,
            .float-buttons, .print-button-container, .share-button {
                display: none !important;
            }
            
            .form-element::before, .form-element::after {
                display: none !important;
            }
            
            .scale-mark {
                display: block !important;
                visibility: visible !important;
                color: #e74c3c !important;
                font-weight: bold !important;
                font-size: 24px !important;
            }
            
            input, textarea {
                border: 1px solid #ccc !important;
                background: white !important;
                padding: 3mm !important;
            }
            
            .placeholder-hint {
                display: block !important;
                color: #777 !important;
                font-style: italic !important;
                margin-bottom: 1mm !important;
                font-size: 10pt !important;
            }
        }
    `;
    document.head.appendChild(printStyle);
});

// Verbeterde notificatiefunctie - verplaatst naar rechtsboven het formulier
function showNotification(message, type = "info") {
    // Maak container voor notificaties als deze nog niet bestaat
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        
        // Positioneer de container rechtsboven het formulier
        const formContainer = document.getElementById('formContainer');
        if (formContainer) {
            const formRect = formContainer.getBoundingClientRect();
            container.style.top = `${formRect.top}px`;
            container.style.right = '20px';
            container.style.position = 'fixed';
        } else {
            // Fallback als formContainer niet gevonden wordt
            container.style.top = '20px';
            container.style.right = '20px';
            container.style.position = 'fixed';
        }
        
        document.body.appendChild(container);
    }
    
    // Maak een nieuwe notificatie
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Maak de inhoud van de notificatie
    const content = document.createElement('div');
    content.className = 'notification-content';
    content.textContent = message;
    
    // Maak een sluitknop
    const closeButton = document.createElement('button');
    closeButton.className = 'notification-close';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = function() {
        container.removeChild(notification);
    };
    
    // Voeg content en sluitknop toe aan notificatie
    notification.appendChild(content);
    notification.appendChild(closeButton);
    
    // Animatie voor het binnenkomen
    notification.style.transform = 'translateX(100%)';
    notification.style.opacity = '0';
    
    // Voeg notificatie toe aan container
    container.appendChild(notification);
    
    // Start animatie
    setTimeout(() => {
        notification.style.transition = 'all 0.3s ease-out';
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 10);
    
    // Automatisch verwijderen na 4 seconden
    setTimeout(function() {
        if (notification.parentNode === container) {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode === container) {
                    container.removeChild(notification);
                }
            }, 300);
        }
    }, 4000);
}

// Add function to show/hide empty form message
function updateEmptyFormMessage() {
    const formContent = document.getElementById('formContent');
    const emptyMessage = document.querySelector('.empty-form-message');
    
    if (formContent && emptyMessage) {
        if (formContent.children.length === 0) {
            emptyMessage.style.display = 'block';
        } else {
            emptyMessage.style.display = 'none';
        }
    }
}

let templates = {};

function setupTherapyDropdown() {
    const therapyDropdown = document.getElementById('therapyDropdown');
    therapyDropdown.addEventListener('change', function() {
        const selectedTherapy = this.value;
        resetTemplateDropdown();
        templates = {}; // Reset the templates object
        
        if (selectedTherapy) {
            // Show loading indicator
            const loadingIndicator = therapyDropdown.parentNode.querySelector('.loading-indicator');
            if (loadingIndicator) {
                loadingIndicator.style.display = 'inline-block';
            }
            
            const templateDropdown = document.getElementById('templateDropdown');
            templateDropdown.innerHTML = '<option value="">Laden...</option>';
            
            filterTemplatesByTherapy(selectedTherapy);
        }
    });
}

function resetTemplateDropdown() {
    const templateDropdown = document.getElementById('templateDropdown');
    templateDropdown.innerHTML = '<option value="">Kies een template</option>';
}

function filterTemplatesByTherapy(therapy) {
    console.log(`Filtering templates for therapy type: ${therapy}`);
    
    // Define template files by therapy type
    const templateFilesByTherapy = {
        'CGT': ['CGT1.json', 'CGT2.json', 'CGT3.json', 'CGT4.json', 'CGT5.json'],
        'ACT': ['ACT.json', 'act-json.json'], // Try both case variations
        'EFT': ['EFT.json'],
        'DGT': ['DGT.json'],
        'SFT': ['SFT.json'],
        'CRISIS': ['CRISIS.json'],
        'FACT': ['FACT.json'],
        'EET': ['EET.json'],
        'PENP': ['PENP.json'],
        'DSM': ['DSM.json'],
        'PGT': ['PGT.json']
    };

    const filesToLoad = templateFilesByTherapy[therapy] || [];
    console.log(`Files to load for therapy ${therapy}:`, filesToLoad);
    
    if (filesToLoad.length === 0) {
        hideLoadingIndicators();
        showNotification("Geen templates gevonden voor deze therapie", "error");
        return;
    }
    
    loadSpecificTemplates(filesToLoad);
}

function loadSpecificTemplates(files) {
    // Get base URL for fetching
    const baseUrl = window.location.href.split('?')[0].split('#')[0];
    const basePath = baseUrl.endsWith('/') ? baseUrl : baseUrl.substring(0, baseUrl.lastIndexOf('/') + 1);
    
    console.log("Attempting to load template files:", files);
    console.log("Base URL for loading:", basePath);
    
    // Create array to track successful loads
    let successfulLoads = 0;
    
    const promises = files.map(file => {
        const fileUrl = `${basePath}${file}`;
        console.log(`Fetching ${fileUrl}`);
        
        return fetch(fileUrl)
            .then(response => {
                console.log(`Status for ${file}:`, response.status);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                successfulLoads++;
                console.log(`Successfully loaded ${file}. Data:`, data);
                
                if (!data || typeof data !== 'object') {
                    console.error(`Invalid JSON data in ${file}`);
                    return;
                }
                
                const keys = Object.keys(data);
                console.log(`Template keys in ${file}:`, keys);
                
                if (keys.length === 0) {
                    console.warn(`No template keys found in ${file}`);
                    return;
                }
                
                keys.forEach(key => {
                    templates[key] = data[key];
                });
                
                console.log("Templates object updated:", Object.keys(templates));
            })
            .catch(error => {
                console.error(`Error loading ${file}:`, error);
            });
    });

    Promise.all(promises)
    .then(() => {
        // Hide all loading indicators
        hideLoadingIndicators();
        
        const templateKeys = Object.keys(templates);
        console.log("Final templates object keys:", templateKeys);
        
        if (templateKeys.length > 0) {
            populateTemplateDropdown(templateKeys);
            showNotification(`${templateKeys.length} templates geladen`, "success");
        } else if (successfulLoads === 0) {
            console.error("Failed to load any templates");
            showNotification("Kon geen templates laden. Controleer de browser console voor details.", "error");
        } else {
            console.warn("Templates loaded but no valid template keys found");
            showNotification("Templates geladen maar geen geldige sjablonen gevonden", "warning");
        }
    })
    .catch(error => {
        // Hide all loading indicators
        hideLoadingIndicators();
        
        console.error('Error loading templates:', error);
        showNotification("Er is een fout opgetreden bij het laden van templates", "error");
    });
}

function populateTemplateDropdown(templateKeys) {
    const templateDropdown = document.getElementById('templateDropdown');
    
    // Clear any existing options first
    templateDropdown.innerHTML = '<option value="">Kies een template</option>';
    
    // Sort template keys alphabetically for better user experience
    templateKeys.sort().forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.text = key;
        templateDropdown.add(option);
    });
    
    setupTemplateChangeHandler();
    
    // Auto-select first template if only one is available
    if (templateKeys.length === 1) {
        templateDropdown.value = templateKeys[0];
        // Trigger change event
        templateDropdown.dispatchEvent(new Event('change'));
    }
}

function setupTemplateChangeHandler() {
    const templateDropdown = document.getElementById('templateDropdown');
    
    // Remove any existing event listeners to prevent duplicates
    const newDropdown = templateDropdown.cloneNode(true);
    templateDropdown.parentNode.replaceChild(newDropdown, templateDropdown);
    
    newDropdown.addEventListener('change', function() {
        const selectedTemplate = this.value;
        
        if (!selectedTemplate) {
            return;
        }
        
        if (!templates[selectedTemplate]) {
            showNotification("Template niet gevonden", "error");
            return;
        }
        
        displayTemplate(templates[selectedTemplate]);
        showNotification("Template geladen", "success");
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
        
        // Update empty form message visibility
        updateEmptyFormMessage();
    } else {
        updateEmptyFormMessage();
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
            html += `
                <label class="editable">Datum</label>
                <div class="input-container">
                    <div class="placeholder-hint">Voer datum in</div>
                    <input type="text">
                </div>`;
            break;
        case 'time':
            html += `
                <label class="editable">Tijd</label>
                <div class="input-container">
                    <div class="placeholder-hint">Voer tijd in</div>
                    <input type="text">
                </div>`;
            break;
        case 'number':
            html += `
                <label class="editable">${element.label}</label>
                <div class="input-container">
                    <input type="number" min="${element.min}" max="${element.max || ''}">
                </div>`;
            break;
        case 'textarea':
            html += `
                <label class="editable">${element.label}</label>
                <div class="input-container">
                    <div class="placeholder-hint">${element.placeholder || 'Voer tekst in'}</div>
                    <textarea placeholder="${element.placeholder || 'Voer tekst in'}"></textarea>
                </div>`;
            break;
        case 'rating':
            html += `<label class="editable">${element.label}</label>
                    <div class="rating-options">`;
            
            // Create numbered radio buttons from 1 to max (default 10)
            const max = element.max || 10;
            for (let i = 1; i <= max; i++) {
                html += `
                    <div class="rating-option">
                        <input type="radio" id="rating-${i}-${Date.now()}" name="rating-${Date.now()}" value="${i}">
                        <label for="rating-${i}-${Date.now()}">${i}</label>
                    </div>`;
            }
            html += `</div>`;
            break;
        case 'checkbox':
            html += `<label class="editable">${element.label}</label><div class="checkbox-group">`;
            
            // Create two columns for checkbox items
            const leftColumn = [];
            const rightColumn = [];
            
            // Split options into two columns
            element.options.forEach((option, index) => {
                const checkboxItem = `<div class="checkbox-item"><input type="checkbox"><span class="editable">${option}</span></div>`;
                if (index % 2 === 0) {
                    leftColumn.push(checkboxItem);
                } else {
                    rightColumn.push(checkboxItem);
                }
            });
            
            // Add all checkbox items
            leftColumn.forEach(item => {
                html += item;
            });
            rightColumn.forEach(item => {
                html += item;
            });
            
            html += `</div><button class="add-checkbox" onclick="addCheckboxItem(this)">+</button><button class="remove-checkbox" onclick="removeCheckboxItem(this)">-</button>`;
            break;
        case 'dropdown':
            // Convert dropdown to radio button group for better print compatibility
            html += `<label class="editable">${element.label}</label>
                    <div class="radio-group">`;
            
            // Create unique name for this radio group
            const radioGroupName = `radio-group-${Date.now()}`;
            
            // Split into two columns similar to checkboxes
            const leftRadios = [];
            const rightRadios = [];
            
            element.options.forEach((option, index) => {
                const radioId = `radio-${radioGroupName}-${index}`;
                const radioItem = `
                    <div class="radio-item">
                        <input type="radio" id="${radioId}" name="${radioGroupName}" value="${option}">
                        <label for="${radioId}" class="radio-label">${option}</label>
                    </div>`;
                
                if (index % 2 === 0) {
                    leftRadios.push(radioItem);
                } else {
                    rightRadios.push(radioItem);
                }
            });
            
            // Add all radio items
            leftRadios.forEach(item => {
                html += item;
            });
            rightRadios.forEach(item => {
                html += item;
            });
            
            html += `</div>`;
            break;
        case 'text':
            html += `
                <label class="editable">${element.label}</label>
                <div class="input-container">
                    <div class="placeholder-hint">${element.placeholder || 'Voer tekst in'}</div>
                    <input type="text" placeholder="${element.placeholder || 'Voer tekst in'}">
                </div>`;
            break;
        case 'scaleImage':
            // Generate dynamic scale image instead of using external file
            const scaleImageUrl = generateScaleImage();
            html += `
                <div class="scale-image-container">
                    <label class="editable">${element.label}</label>
                    <img src="${scaleImageUrl}" alt="Schaal" class="scale-image">
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
    updateEmptyFormMessage();
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
    updateEmptyFormMessage();
}

function addHeader() {
    const formContent = document.getElementById('formContent');
    const headerElement = createFormElement({
        type: 'header',
        text: 'Titel',
        class: 'header-element'
    });
    formContent.insertAdjacentHTML('afterbegin', headerElement);

    initSortable();
    initEditable();
    updateEmptyFormMessage();
}

function addRatingScale() {
    const formContent = document.getElementById('formContent');
    const ratingScaleElement = createFormElement({
        type: 'rating',
        label: 'Schaal',
        max: 10
    });
    formContent.insertAdjacentHTML('afterbegin', ratingScaleElement);
    initSortable();
    initEditable();
    updateEmptyFormMessage();
}

function addScaleImage() {
    const formContent = document.getElementById('formContent');
    
    // Create element using the dynamic scale image
    const scaleImageElement = createFormElement({
        type: 'scaleImage',
        label: 'Intensiteit'
    });
    
    formContent.insertAdjacentHTML('afterbegin', scaleImageElement);
    
    // Initialize the newly added scale image
    initSortable();
    initEditable();
    
    // Initialize the newly added scale image with click functionality
    const newScaleImage = formContent.querySelector('.form-element:first-child .scale-image');
    if (newScaleImage) {
        initializeScaleImageComponents();
    }
    
    updateEmptyFormMessage();
    saveState();
}

function removeCheckboxItem(button) {
    const checkboxGroup = button.previousElementSibling.previousElementSibling;
    if (checkboxGroup.children.length > 0) {
        checkboxGroup.removeChild(checkboxGroup.lastElementChild);
    }
}

function printForm() {
    const formContent = document.getElementById('formContent');
    
    // Create a print-specific stylesheet
    const printStyle = document.createElement('style');
    printStyle.id = 'print-style';
    printStyle.innerHTML = `
        @media print {
            body * {
                visibility: hidden;
                background: white !important;
            }
            
            #formContent, #formContent * {
                visibility: visible;
            }
            
            #formContainer {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                padding: 15mm;
                box-shadow: none;
                border: none;
                margin: 0;
            }
            
            .form-element {
                page-break-inside: avoid;
                border: none;
                box-shadow: none;
                background: none !important;
                padding: 5mm 0;
                margin-bottom: 5mm;
            }
            
            .remove-element, .add-checkbox, .remove-checkbox, .float-buttons, .share-button {
                display: none !important;
            }
            
            .scale-mark {
                display: block !important;
                visibility: visible !important;
                color: #e74c3c !important;
                font-weight: bold !important;
                font-size: 24px !important;
            }
            
            input, textarea {
                border: 1px solid #ccc !important;
                background: white !important;
                padding: 3mm !important;
            }
            
            .placeholder-hint {
                display: block !important;
                color: #777 !important;
                font-style: italic !important;
                margin-bottom: 1mm !important;
                font-size: 10pt !important;
            }
        }
    `;
    document.head.appendChild(printStyle);
    
    // Show all placeholder hints for printing
    const placeholderHints = formContent.querySelectorAll('.placeholder-hint');
    placeholderHints.forEach(hint => {
        hint.style.display = 'block';
    });
    
    // Ensure scale marks are visible
    const scaleMarks = formContent.querySelectorAll('.scale-mark');
    scaleMarks.forEach(mark => {
        mark.style.display = 'block';
        mark.style.visibility = 'visible';
        mark.style.color = '#e74c3c';
        mark.style.fontWeight = 'bold';
        mark.style.fontSize = '24px';
    });
    
    // Print the form
    window.print();
    
    // After printing, restore elements to original state and remove the style
    setTimeout(() => {
        document.head.removeChild(printStyle);
        
        // Restore placeholder hints visibility
        placeholderHints.forEach(hint => {
            hint.style.display = '';
        });
    }, 500);
}

// Add these functions after the printForm function
function hideLoadingIndicators() {
    document.querySelectorAll('.loading-indicator').forEach(indicator => {
        indicator.style.display = 'none';
    });
}

// Add a direct template loading function to use as fallback
function loadTemplateDirectly(therapy, file) {
    const baseUrl = window.location.href.split('?')[0].split('#')[0];
    const basePath = baseUrl.endsWith('/') ? baseUrl : baseUrl.substring(0, baseUrl.lastIndexOf('/') + 1);
    const fileUrl = `${basePath}${file}`;
    
    console.log(`Attempting direct load of: ${fileUrl}`);
    
    fetch(fileUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(`Direct load successful for ${file}:`, data);
            
            // Store templates and update dropdown
            templates = data;
            const templateKeys = Object.keys(templates);
            
            if (templateKeys.length > 0) {
                populateTemplateDropdown(templateKeys);
                showNotification(`${templateKeys.length} templates geladen`, "success");
            } else {
                showNotification("Geen geldige templates gevonden in bestand", "warning");
            }
        })
        .catch(error => {
            console.error(`Direct load failed for ${file}:`, error);
            showNotification(`Kon bestand ${file} niet laden`, "error");
        })
        .finally(() => {
            hideLoadingIndicators();
        });
}

// Undo/Redo functionality
let undoStack = [];
let redoStack = [];

function saveState() {
    const currentState = {
        formContent: document.getElementById('form-container').innerHTML,
        formTitle: document.getElementById('form-title').value
    };
    undoStack.push(JSON.stringify(currentState));
    redoStack = []; // Clear redo stack on new action
    updateUndoRedoButtons();
}

function undo() {
    if (undoStack.length <= 1) return; // Keep at least the initial state
    
    // Save current state to redo stack
    const currentState = {
        formContent: document.getElementById('form-container').innerHTML,
        formTitle: document.getElementById('form-title').value
    };
    redoStack.push(JSON.stringify(currentState));
    
    // Remove current state from undo stack
    undoStack.pop();
    
    // Apply previous state
    const previousState = JSON.parse(undoStack[undoStack.length - 1]);
    document.getElementById('form-container').innerHTML = previousState.formContent;
    document.getElementById('form-title').value = previousState.formTitle;
    
    // Reattach event listeners
    attachEventListeners();
    updateUndoRedoButtons();
}

function redo() {
    if (redoStack.length === 0) return;
    
    // Get state from redo stack
    const nextState = JSON.parse(redoStack.pop());
    
    // Save current state to undo stack
    const currentState = {
        formContent: document.getElementById('form-container').innerHTML,
        formTitle: document.getElementById('form-title').value
    };
    undoStack.push(JSON.stringify(currentState));
    
    // Apply next state
    document.getElementById('form-container').innerHTML = nextState.formContent;
    document.getElementById('form-title').value = nextState.formTitle;
    
    // Reattach event listeners
    attachEventListeners();
    updateUndoRedoButtons();
}

function updateUndoRedoButtons() {
    document.getElementById('undoButton').disabled = undoStack.length <= 1;
    document.getElementById('redoButton').disabled = redoStack.length === 0;
}

// Modify existing functions to save state after changes
const originalAddFormElement = addFormElement;
addFormElement = function(type) {
    originalAddFormElement(type);
    saveState();
};

const originalRemoveFormElement = removeFormElement;
removeFormElement = function(event) {
    originalRemoveFormElement(event);
    saveState();
};

// Handler function for scale image clicks
function handleScaleClick(e) {
    // Calculate position relative to the image
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const relativeX = x / rect.width;
    
    // Remove any existing marks
    const existingMarks = this.parentElement.querySelectorAll('.scale-mark');
    existingMarks.forEach(mark => mark.remove());
    
    // Create X mark
    const mark = document.createElement('div');
    mark.className = 'scale-mark';
    mark.textContent = 'X';
    mark.style.left = `${relativeX * 100}%`;
    mark.style.color = 'red'; // Ensure X is red
    mark.style.fontWeight = 'bold'; // Make it bold
    mark.style.position = 'absolute';
    mark.style.top = '50%';
    mark.style.transform = 'translateY(-50%)';
    mark.style.zIndex = '10';
    mark.style.fontSize = '24px';
    mark.style.textShadow = '1px 1px 3px rgba(0, 0, 0, 0.2)';
    
    // Add the mark to the parent container
    this.parentElement.appendChild(mark);
    
    // Store the position for later use
    this.dataset.markPosition = relativeX;
    
    // Save state after marking
    saveState();
}

// Function to attach click handler to scale images
function attachScaleClickHandler(scaleImage) {
    if (!scaleImage) return;
    
    // Remove any existing click event to prevent duplicates
    scaleImage.removeEventListener('click', handleScaleClick);
    
    // Add the click event listener
    scaleImage.addEventListener('click', handleScaleClick);
}

// Create a dynamic scale function
function generateScaleImage() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 500;
    canvas.height = 80;
    
    // Fill background
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw scale line
    ctx.beginPath();
    ctx.moveTo(50, 40);
    ctx.lineTo(450, 40);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#333';
    ctx.stroke();
    
    // Draw ticks and numbers
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    
    for (let i = 0; i <= 10; i++) {
        const x = 50 + (i * 40);
        
        // Draw tick
        ctx.beginPath();
        ctx.moveTo(x, 35);
        ctx.lineTo(x, 45);
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw number
        ctx.fillText(i, x, 65);
    }
    
    // Convert to data URL and return
    return canvas.toDataURL('image/png');
}

// Function to share the form
function shareForm() {
    // Create the share data
    const formContent = document.getElementById('formContent');
    const formData = {
        content: formContent.innerHTML,
        timestamp: new Date().getTime()
    };
    
    const jsonData = JSON.stringify(formData);
    const encodedData = encodeURIComponent(jsonData);
    const shareUrl = `${window.location.href.split('?')[0]}?form=${encodedData}`;
    
    // Try native share API first (mobile devices)
    if (navigator.share) {
        navigator.share({
            title: 'GGZ Formulier',
            text: 'Bekijk dit ingevulde GGZ formulier',
            url: shareUrl
        })
        .then(() => showNotification('Formulier gedeeld!', 'success'))
        .catch(error => {
            console.error('Error sharing:', error);
            showNotification('Delen mislukt, kopieer de link handmatig', 'error');
            fallbackShare(shareUrl);
        });
    } else {
        // Fallback for desktop
        fallbackShare(shareUrl);
    }
}

// Fallback share method
function fallbackShare(shareUrl) {
    // Create a simple modal with the share URL
    const modalContent = document.createElement('div');
    
    const label = document.createElement('p');
    label.textContent = 'Kopieer deze link om het formulier te delen:';
    label.style.marginBottom = '10px';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = shareUrl;
    input.style.width = '100%';
    input.style.padding = '8px';
    input.style.marginBottom = '15px';
    input.readOnly = true;
    
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Kopieer link';
    copyButton.style.padding = '8px 16px';
    copyButton.style.background = '#4CAF50';
    copyButton.style.color = 'white';
    copyButton.style.border = 'none';
    copyButton.style.borderRadius = '4px';
    copyButton.style.cursor = 'pointer';
    copyButton.style.margin = '0 auto';
    copyButton.style.display = 'block';
    
    copyButton.addEventListener('click', () => {
        input.select();
        document.execCommand('copy');
        copyButton.textContent = 'Gekopieerd!';
        setTimeout(() => {
            copyButton.textContent = 'Kopieer link';
        }, 2000);
    });
    
    // Add WhatsApp share if on mobile
    const whatsappButton = document.createElement('a');
    whatsappButton.href = `https://api.whatsapp.com/send?text=${encodeURIComponent('GGZ Formulier: ' + shareUrl)}`;
    whatsappButton.target = '_blank';
    whatsappButton.style.display = 'block';
    whatsappButton.style.marginTop = '10px';
    whatsappButton.style.textAlign = 'center';
    whatsappButton.style.textDecoration = 'none';
    whatsappButton.style.padding = '8px';
    whatsappButton.style.background = '#25D366';
    whatsappButton.style.color = 'white';
    whatsappButton.style.borderRadius = '4px';
    whatsappButton.innerHTML = '<i class="fab fa-whatsapp"></i> Deel via WhatsApp';
    
    modalContent.appendChild(label);
    modalContent.appendChild(input);
    modalContent.appendChild(copyButton);
    modalContent.appendChild(whatsappButton);
    
    showModal('Deel formulier', modalContent);
}

// Function to check for shared form in URL when page loads
function checkForSharedForm() {
    const urlParams = new URLSearchParams(window.location.search);
    const formParam = urlParams.get('form');
    
    if (formParam) {
        try {
            const jsonData = JSON.parse(decodeURIComponent(formParam));
            const formContent = document.getElementById('formContent');
            
            if (jsonData.content && formContent) {
                formContent.innerHTML = jsonData.content;
                
                // Re-initialize components
                initSortable();
                initEditable();
                initializeScaleImageComponents();
                updateEmptyFormMessage();
                
                showNotification('Gedeeld formulier geladen', 'success');
            }
        } catch (error) {
            console.error('Error loading shared form:', error);
            showNotification('Kon gedeeld formulier niet laden', 'error');
        }
    }
}

// Scale Image Component Initialization
function initializeScaleImageComponents() {
    const scaleImages = document.querySelectorAll('.scale-image');
    
    scaleImages.forEach(scaleImage => {
        // Remove existing event listeners to prevent duplicates
        scaleImage.removeEventListener('click', handleScaleClick);
        
        // Add click event to place marker
        scaleImage.addEventListener('click', function(e) {
            // Calculate position relative to the image
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const relativeX = x / rect.width;
            
            // Remove any existing marks
            const existingMarks = this.parentElement.querySelectorAll('.scale-mark');
            existingMarks.forEach(mark => mark.remove());
            
            // Create X mark
            const mark = document.createElement('div');
            mark.className = 'scale-mark';
            mark.textContent = 'X';
            mark.style.left = `${relativeX * 100}%`;
            mark.style.position = 'absolute';
            mark.style.top = '50%';
            mark.style.transform = 'translateY(-50%)';
            mark.style.color = 'red';
            mark.style.fontWeight = 'bold';
            mark.style.fontSize = '24px';
            mark.style.zIndex = '10';
            
            // Add the mark to the parent container
            this.parentElement.appendChild(mark);
            
            // Store the position for later use (like printing)
            this.dataset.markPosition = relativeX;
            
            // Save state after marking
            saveState();
        });
    });
}
