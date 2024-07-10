function initEditable() {
    // Nieuwe code voor invoervelden
    document.querySelectorAll('input[type="text"]').forEach(input => {
        input.addEventListener('dblclick', function() {
            const newText = prompt("Pas de tekst aan:", this.value);
            if (newText !== null) {
                this.value = newText;
            }
        });
    });

    document.querySelectorAll('.edit-icon').forEach(el => {
        el.addEventListener('click', function(e) {
            e.stopPropagation();
            document.querySelectorAll('.edit-options').forEach(opt => opt.remove());
            
            const formElement = this.closest('.form-element');
            const options = document.createElement('div');
            options.className = 'edit-options';
            options.innerHTML = 
                `<button onclick="editElementText(this)">Tekst aanpassen</button>
                <button onclick="removeElement(this)">Verwijderen</button>`;
            formElement.appendChild(options);
            options.style.display = 'block';
        });
    });

    document.querySelectorAll('.editable').forEach(el => {
        el.addEventListener('dblclick', function() {
            const newText = prompt("Pas de tekst aan:", this.textContent);
            if (newText !== null) {
                this.textContent = newText;
            }
        });
    });

    document.querySelectorAll('.remove-icon').forEach(el => {
        el.addEventListener('click', function() {
            this.closest('.form-element').remove();
        });
    });
}

function editElementText(button) {
    const formElement = button.closest('.form-element');
    const editableElements = formElement.querySelectorAll('.editable');
    editableElements.forEach(el => {
        const newText = prompt("Pas de tekst aan:", el.textContent);
        if (newText !== null) {
            el.textContent = newText;
        }
    });
    button.parentElement.remove();
}

function removeElement(button) {
    button.closest('.form-element').remove();
}