import './users.scss';
import sortTable from '../../utils/sortTable';
import initializeFormValidation from '../../utils/formValidation.js';
import showToast from '../../utils/showToast.js';
import showConfirmationModal from '../../utils/showConfirmationModal.js';

// Inicjalizacja walidacji formularza
document.addEventListener('DOMContentLoaded', () => {
    initializeFormValidation();
});


document.addEventListener('DOMContentLoaded', async () => {
    const api = {
        fetchAllUsers: () => fetchJson('/api/users/all'),
        fetchUsers: () => fetchJson('/api/users'),
        fetchUser: (id) => fetchJson(`/api/users/${id}`),
        createUser: (data) => fetchJson('/api/users', { method: 'POST', body: JSON.stringify(data) }),
        updateUser: (id, data) => fetchJson(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        deleteUser: (id) => fetch(`/api/users/${id}`, { method: 'DELETE' })
    };

    const usersTableBody = document.getElementById('usersTableBody');
    const usersTableHeader = document.querySelector('thead');
    const userForm = document.getElementById('userForm');
    const userIdField = document.getElementById('userId');
    const passwordField = document.getElementById('password');
    const userModalLabel = document.getElementById('userModalLabel');
    const selectUserField = document.getElementById('selectUserField');
    const selectUser = document.getElementById('selectUser');
    const userModal = new bootstrap.Modal(document.getElementById('userModal'));
    let sortColumn = null;
    let sortDirection = 1;

    // Ogólna funkcja fetch z obsługą błędów
    const fetchJson = async (url, options = {}) => {
        const response = await fetch(url, {
            headers: { 'Content-Type': 'application/json' },
            ...options,
        });

        const result = await response.json();

        if (!result.success) {
            throw { message: result.message, code: result.code };
        }

        return result.data || result;
    };

    // Reset formularza i przygotowanie do dodania nowego użytkownika
    const resetForm = async () => {
        userForm.reset();
        userIdField.value = '';
        passwordField.placeholder = '';
        selectUserField.classList.remove('d-none');
        passwordField.setAttribute('required', 'required');
        selectUser.setAttribute('required', 'required'); // Pole wyboru użytkownika wymagane
        userModalLabel.textContent = 'Add User';
        await loadAllUsers();
    };

    // Ładowanie wszystkich użytkowników do selektora
    const loadAllUsers = async () => {
        try {
            const users = await api.fetchAllUsers();
            selectUser.innerHTML = '<option value="">Select a user</option>';
            users.forEach(user => {
                selectUser.innerHTML += `<option value="${user.user_id}">${user.name} ${user.surname}</option>`;
            });
        } catch (error) {
            const message = Object.values(errorMessages.users.fetchAll).find(err => err.code === error.code)?.message
                || 'An unexpected error occurred.';
            showToast(message);
        }
    };

    // Ładowanie tabeli użytkowników
    const loadUsers = async () => {
        try {
            const users = await api.fetchUsers();
            usersTableBody.innerHTML = users.map((user, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${user.name}</td>
                            <td>${user.surname}</td>
                            <td>${user.email}</td>
                            <td>
                                <button class="btn btn-secondary btn-sm editUserBtn" data-id="${user.user_id}">Edit</button>
                                <button class="btn btn-danger btn-sm deleteUserBtn" data-id="${user.user_id}">Delete</button>
                            </td>
                        </tr>
                    `).join('');
        } catch (error) {
            const message = Object.values(errorMessages.users.fetchAll).find(err => err.code === error.code)?.message
                || 'An unexpected error occurred.';
            showToast(message);
        }
    };

    // Obsługa kliknięcia przycisków edycji i usuwania
    usersTableBody.addEventListener('click', async (event) => {
        const target = event.target;

        // Ignoruj kliknięcia na inne elementy
        if (!target.matches('.editUserBtn, .deleteUserBtn')) {
            return;
        }

        const id = target.dataset.id;

        if (!id) {
            console.error('User ID is undefined');
            return;
        }

        try {
            // Obsługa edycji
            if (target.classList.contains('editUserBtn')) {
                const user = await api.fetchUser(id);
                if (!user || !user.user_id) {
                    throw new Error('Invalid user data');
                }
                userIdField.value = user.user_id;
                document.getElementById('email').value = user.email;
                passwordField.placeholder = 'Enter new password or leave blank';
                selectUserField.classList.add('d-none');
                selectUser.removeAttribute('required');
                passwordField.removeAttribute('required');
                userModalLabel.textContent = 'Edit User';
                userModal.show();
            }
            // Obsługa usuwania
            else if (target.classList.contains('deleteUserBtn')) {
                const confirmed = await showConfirmationModal(
                    'Delete User',
                    'Are you sure you want to delete this user? This action cannot be undone.'
                );
                if (confirmed) {
                    try {
                        const response = await api.deleteUser(id);
                        showToast(response.message || 'User deleted successfully.', 'success');
                        loadUsers(); // Odśwież listę użytkowników
                    } catch (error) {
                        const message = Object.values(errorMessages.users.delete).find(err => err.code === error.code)?.message
                            || 'Failed to delete the user.';
                        showToast(message, 'danger');
                    }
                }
            }
        } catch (error) {
            showToast(error.message || errorMessages.users.fetch.default);
        }
    });

    // Obsługa zapisu formularza
    userForm.onsubmit = async function (event) {
        event.preventDefault();

        if (!this.checkValidity()) {
            this.classList.add('was-validated'); // Dodaj klasy walidacyjne Bootstrapa
            return; // Zatrzymaj, jeśli formularz jest niepoprawny
        }
        const userId = parseInt(selectUser.value || userIdField.value, 10);
        const email = document.getElementById('email').value;
        const password = passwordField.value;

        const data = { user_id: userId, email };
        if (password) data.password = password;

        try {
            if (userIdField.value) {
                await api.updateUser(userIdField.value, data);
            } else {
                await api.createUser(data);
            }
            userModal.hide();
            loadUsers();
            showToast('User saved successfully!', 'success');
        } catch (error) {
            const message = Object.values(errorMessages.users.create).find(err => err.code === error.code)?.message
                || 'Failed to delete the user.';
            showToast(message);
        }
    };


    // Sortowanie nagłówków tabeli
    const attachSortingToHeaders = () => {
        const headers = usersTableHeader.querySelectorAll('.sortable');

        // Ustaw domyślne sortowanie
        const defaultColumnIndex = 0; // Pierwsza kolumna (np. ID)
        sortColumn = `td:nth-child(${defaultColumnIndex + 1})`;
        sortDirection = 1; // Rosnące sortowanie

        // Sortuj tabelę od razu na starcie
        sortTable(usersTableBody, sortColumn, sortDirection);

        headers.forEach((header, index) => {
            const icon = header.querySelector('.sort-icon');

            // Ustaw ikonę dla domyślnej kolumny
            if (index === defaultColumnIndex) {
                icon.textContent = '▲';
                icon.classList.add('active');
            }

            // Obsługa kliknięcia w nagłówki
            header.addEventListener('click', () => {
                const columnSelector = `td:nth-child(${index + 1})`;

                if (sortColumn === columnSelector) {
                    sortDirection *= -1; // Zmień kierunek sortowania
                } else {
                    sortColumn = columnSelector;
                    sortDirection = 1; // Ustaw kierunek na rosnący
                }

                // Reset ikon sortowania
                headers.forEach(h => {
                    const i = h.querySelector('.sort-icon');
                    i.textContent = '';
                    i.classList.remove('active');
                });

                // Ustaw aktywną ikonę dla wybranego nagłówka
                icon.textContent = sortDirection === 1 ? '▲' : '▼';
                icon.classList.add('active');

                // Sortuj tabelę
                sortTable(usersTableBody, columnSelector, sortDirection);
            });
        });
    };


    document.getElementById('addUserBtn').addEventListener('click', resetForm);
    await loadUsers();
    attachSortingToHeaders();
});