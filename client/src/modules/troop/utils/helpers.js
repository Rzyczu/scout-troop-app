export const updateModalTitle = (modal, title) => {
    const modalTitle = modal.querySelector('.modal-title');
    if (modalTitle) modalTitle.textContent = title;
};

export const populateTroopForm = (form, troop) => {
    form.querySelector('#troopNameInput').value = troop.name || '';
    form.querySelector('#troopDescriptionInput').value = troop.description || '';
};
