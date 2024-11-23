export default function showConfirmationModal(title, message) {
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
