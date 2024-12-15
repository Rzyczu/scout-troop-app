export function showToast(message, type = 'danger') {
    const toastContainer = document.getElementById('toast-messages');

    // Create the toast element
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');

    // Toast content
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

    // Append toast to container
    toastContainer.appendChild(toast);

    // Initialize Bootstrap toast
    const bootstrapToast = new bootstrap.Toast(toast, {
        delay: 10000, // 10 sekund
    });
    bootstrapToast.show();

    // Remove the toast after it's hidden
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}


export function showConfirmationModal(title, message) {
    return new Promise((resolve) => {
        // Tworzenie elementu modala
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.setAttribute('tabindex', '-1');
        modal.setAttribute('aria-hidden', 'true');
        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>${message}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-danger" id="confirmButton">Confirm</button>
                    </div>
                </div>
            </div>
        `;

        // Dodaj modal do dokumentu
        document.body.appendChild(modal);

        // Inicjalizacja Bootstrap modal
        const bootstrapModal = new bootstrap.Modal(modal);

        // Obsługa potwierdzenia
        modal.querySelector('#confirmButton').addEventListener('click', () => {
            resolve(true);
            bootstrapModal.hide();
        });

        // Obsługa anulowania
        modal.addEventListener('hidden.bs.modal', () => {
            resolve(false);
            modal.remove(); // Usuń modal z DOM po jego zamknięciu
        });

        // Pokaż modal
        bootstrapModal.show();
    });
}

const customAllowList = bootstrap.Tooltip.Default.allowList;

// Dodaj obsługę tabelki oraz jej elementów
customAllowList.table = [];
customAllowList.thead = [];
customAllowList.tr = [];
customAllowList.th = [];
customAllowList.td = [];
customAllowList.tbody = [];


export function showTooltip(targetElement, generateMessageFn, position = "top") {
    if (!targetElement) return;

    // Dynamically generate tooltip message
    const message = generateMessageFn();

    // Attach tooltip attributes
    targetElement.setAttribute('data-bs-toggle', 'tooltip');
    targetElement.setAttribute('data-bs-html', 'true'); // Allow HTML for better formatting
    targetElement.setAttribute('title', message);
    targetElement.setAttribute('data-bs-placement', position);
    targetElement.setAttribute('allowList', customAllowList);

    const tooltip = new bootstrap.Tooltip(targetElement);

    return tooltip;
}
