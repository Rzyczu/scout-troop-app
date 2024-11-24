import './members.scss';
import sortTable from '../../utils/sortTable.js';
import initializeFormValidation from '../../utils/formValidation.js';
import showToast from '../../utils/showToast.js';
import { ScoutFunctions, ScoutRanks, InstructorRanks, mapEnumFullName } from '../../utils/enums.js';
import showConfirmationModal from '../../utils/showConfirmationModal.js';

// Dynamiczne wypełnianie selectów
function populateSelect(selectId, enumData) {
    const select = document.getElementById(selectId);
    if (!select) return;

    Object.entries(enumData).forEach(([key, value]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = typeof value === 'string' ? value : value.full || value.short;
        select.appendChild(option);
    });
}

const addSortableClassToHeaders = () => {
    const headers = tableHeaders.querySelectorAll('th'); // Znajdź wszystkie nagłówki `th`

    headers.forEach((header) => {
        if (!header.textContent.trim().toLowerCase().includes('actions')) {
            header.classList.add('sortable');
        }
    });
};


document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('dateBirth');
    if (dateInput) {
        const today = new Date();
        const maxDate = today.toISOString().split('T')[0]; // Format YYYY-MM-DD
        dateInput.setAttribute('max', maxDate); // Ustaw maksymalną datę na dzisiejszy dzień
    }

    initializeFormValidation([
        {
            selector: '#dateBirth',
            validate: (value) => {
                const today = new Date();
                const birthDate = new Date(value);

                // Sprawdź, czy data jest prawidłowa
                if (isNaN(birthDate.getTime())) {
                    return false; // Data jest nieprawidłowa
                }

                const age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                const dayDiff = today.getDate() - birthDate.getDate();

                // Wiek musi być w zakresie 6-100 lat oraz data nie może być w przyszłości
                return (
                    age >= 6 &&
                    age <= 100 &&
                    (age > 6 || monthDiff >= 0) &&
                    (age > 6 || monthDiff > 0 || dayDiff >= 0) &&
                    birthDate <= today
                );
            },
            message: 'Invalid date of birth. Must be between 6 and 100 years old, and not in the future.',
        },
        {
            selector: '#phoneNumber' || '#fatherPhoneNumber' || '#motherPhoneNumber',
            validate: (value) => {
                const phoneRegex = /^(\+?[0-9]{1,3})?[0-9]{9,12}$/; // Obsługuje format międzynarodowy i lokalny
                return phoneRegex.test(value);
            },
            message: 'Invalid phone number. Must be 9-12 digits and optionally include a country code.',
        }
    ]);
    populateSelect('scoutFunction', ScoutFunctions);
    populateSelect('openRank', ScoutRanks);
    populateSelect('achievedRank', ScoutRanks);
    populateSelect('instructorRank', InstructorRanks);
});



document.addEventListener('DOMContentLoaded', async () => {
    const api = {
        fetchAllMembers: () => fetchJson('/api/members'),
        fetchMember: (id) => fetchJson(`/api/members/${id}`),
        createMember: (data) => fetchJson('/api/members', { method: 'POST', body: JSON.stringify(data) }),
        updateMember: (id, data) => fetchJson(`/api/members/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        deleteMember: (id) => fetch(`/api/members/${id}`, { method: 'DELETE' }),
    };

    const membersTableBody = document.getElementById('membersTableBody');
    const tableHeaders = document.getElementById('tableHeaders');
    const memberForm = document.getElementById('memberForm');
    const memberModal = new bootstrap.Modal(document.getElementById('memberModal'));
    let currentView = 'basic'; // Domyślny widok
    let sortColumn = null;
    let sortDirection = 1;

    document.querySelectorAll('.view-btn').forEach((btn) => {
        btn.classList.remove('active');
    });
    document.getElementById(`view${currentView.charAt(0).toUpperCase() + currentView.slice(1)}`).classList.add('active');

    // Funkcja pomocnicza do fetchowania z obsługą błędów
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

    // Funkcja do resetowania formularza
    const resetForm = () => {
        memberForm.reset();
        document.getElementById('memberModalLabel').textContent = 'Add Member';
        // Wyczyść ukryte pola i placeholdery
        document.getElementById('phoneNumber').value = '';
        document.getElementById('motherPhoneNumber').value = '';
        document.getElementById('fatherPhoneNumber').value = '';
        document.getElementById('parentEmail1').value = '';
        document.getElementById('parentEmail2').value = '';
        document.getElementById('scoutFunction').value = '0';
        document.getElementById('openRank').value = '0';
        document.getElementById('achievedRank').value = '0';
        document.getElementById('instructorRank').value = '0';

        document.getElementById('userId').value = '';
    };

    // Funkcja do ładowania widoków
    const loadMembers = async () => {
        try {
            const members = await api.fetchAllMembers();

            // Nagłówki tabeli
            tableHeaders.innerHTML = getTableHeaders();
            addSortableClassToHeaders();
            attachSortingToHeaders();

            // Ciało tabeli
            membersTableBody.innerHTML = members
                .map((member, index) => renderTableRow(member, index + 1)) // Przekazanie indeksu
                .join('');

        } catch (error) {
            showToast(error.message || 'Failed to fetch members.', 'danger');
        }
    };


    // Funkcja do renderowania nagłówków
    const getTableHeaders = () => {
        switch (currentView) {
            case 'basic':
                return `
                    <th data-sort="id">ID</th>
                    <th>Name</th>
                    <th>Surname</th>
                    <th>Date of Birth</th>
                    <th>Actions</th>`;
            case 'contact':
                return `
                    <th data-sort="id">ID</th>
                    <th>Name</th>
                    <th>Surname</th>
                    <th>Phone Number</th>
                    <th>Email 1</th>
                    <th>Email 2</th>
                    <th>Actions</th>`;
            case 'scout':
                return `
                    <th data-sort="id">ID</th>
                    <th>Name</th>
                    <th>Surname</th>
                    <th>Function</th>
                    <th>Open Rank</th>
                    <th>Achieved Rank</th>
                    <th>Instructor Rank</th>
                    <th>Actions</th>`;
        }
    };

    // Funkcja do renderowania wiersza tabeli
    const renderTableRow = (member, index) => {
        const { user_id, name, surname, date_birth, phone_number, parent_email_1, parent_email_2, function: scoutFunction, open_rank, achieved_rank, instructor_rank } = member;

        switch (currentView) {
            case 'basic':
                return `
                    <tr>
                        <td>${index}</td> 
                        <td>${name}</td>
                        <td>${surname}</td>
                        <td>${new Date(date_birth).toLocaleDateString()}</td>
                        <td>
                            <button class="btn btn-secondary btn-sm editMemberBtn" data-id="${user_id}">Edit</button>
                            <button class="btn btn-danger btn-sm deleteMemberBtn" data-id="${user_id}">Delete</button>
                        </td>
                    </tr>`;
            case 'contact':
                return `
                    <tr>
                        <td>${index}</td> 
                        <td>${name}</td>
                        <td>${surname}</td>
                        <td>${phone_number || '-'}</td>
                        <td>${parent_email_1 || '-'}</td>
                        <td>${parent_email_2 || '-'}</td>
                        <td>
                            <button class="btn btn-secondary btn-sm editMemberBtn" data-id="${user_id}">Edit</button>
                            <button class="btn btn-danger btn-sm deleteMemberBtn" data-id="${user_id}">Delete</button>
                        </td>
                    </tr>`;
            case 'scout':
                return `
                    <tr>
                        <td>${index}</td> 
                        <td>${name}</td>
                        <td>${surname}</td>
                        <td>${ScoutFunctions[scoutFunction] || '-'}</td>
                        <td>${ScoutRanks[open_rank]?.full || '-'}</td>
                        <td>${ScoutRanks[achieved_rank]?.full || '-'}</td >
                        <td>${InstructorRanks[instructor_rank]?.full || '-'}</td >

            <td>
                <button class="btn btn-secondary btn-sm editMemberBtn" data-id="${user_id}">Edit</button>
                <button class="btn btn-danger btn-sm deleteMemberBtn" data-id="${user_id}">Delete</button>
            </td>
                    </tr > `;
        }
    };

    const updateActiveViewButton = () => {

        document.querySelectorAll('.view-btn').forEach((btn) => {
            btn.classList.remove('active');
        });
        document.getElementById(`view${currentView.charAt(0).toUpperCase() + currentView.slice(1)}`).classList.add('active');
    };

    // Obsługa kliknięcia przycisków widoku
    document.getElementById('viewBasic').addEventListener('click', () => {
        currentView = 'basic';
        updateActiveViewButton();
        loadMembers();
    });
    document.getElementById('viewContact').addEventListener('click', () => {
        currentView = 'contact';
        updateActiveViewButton();
        loadMembers();
    });
    document.getElementById('viewScout').addEventListener('click', () => {
        currentView = 'scout';
        updateActiveViewButton();
        loadMembers();
    });

    membersTableBody.addEventListener('click', async (event) => {
        const target = event.target;

        if (target.classList.contains('editMemberBtn')) {
            const memberId = target.dataset.id;

            try {
                const member = await api.fetchMember(memberId);

                if (!member) {
                    throw new Error('Member not found.');
                }

                // Wypełnij formularz danymi użytkownika
                document.getElementById('name').value = member.name;
                document.getElementById('surname').value = member.surname;
                document.getElementById('dateBirth').value = new Date(member.date_birth).toISOString().split('T')[0];

                // Kontakt
                document.getElementById('phoneNumber').value = member.phone_number || '';
                document.getElementById('motherPhoneNumber').value = member.mother_phone_number || '';
                document.getElementById('fatherPhoneNumber').value = member.father_phone_number || '';
                document.getElementById('parentEmail1').value = member.parent_email_1 || '';
                document.getElementById('parentEmail2').value = member.parent_email_2 || '';

                // Harcerskie
                document.getElementById('scoutFunction').value = member.function || '0';
                document.getElementById('openRank').value = member.open_rank || '0';
                document.getElementById('achievedRank').value = member.achieved_rank || '0';
                document.getElementById('instructorRank').value = member.instructor_rank || '0';

                document.getElementById('userId').value = memberId;

                document.getElementById('memberModalLabel').textContent = 'Edit Member';
                memberModal.show();
            } catch (error) {
                showToast(error.message || 'Failed to fetch member data.', 'danger');
            }
        } else if (target.classList.contains('deleteMemberBtn')) {
            const confirmed = await showConfirmationModal(
                'Delete Member',
                'Are you sure you want to delete this member?'
            )

            if (confirmed) {
                try {
                    await api.deleteMember(target.dataset.id);
                    showToast('Member deleted successfully.', 'success');
                    loadMembers();
                } catch (error) {
                    showToast(error.message || 'Failed to delete member.', 'danger');
                }
            }
        }
    });


    // Obsługa formularza
    memberForm.onsubmit = async function (event) {
        event.preventDefault();

        if (!this.checkValidity()) {
            this.classList.add('was-validated');
            return;
        }

        const formData = new FormData(this);

        const payload = {
            user_id: formData.get('userId'),
            user: {
                name: formData.get('name'),
                surname: formData.get('surname'),
                date_birth: formData.get('dateBirth'),
            },
            contact: {
                phone_number: formData.get('phoneNumber'),
                mother_phone_number: formData.get('motherPhoneNumber'),
                father_phone_number: formData.get('fatherPhoneNumber'),
                parent_email_1: formData.get('parentEmail1'),
                parent_email_2: formData.get('parentEmail2'),
            },
            scout: {
                function: formData.get('scoutFunction'),
                open_rank: formData.get('openRank'),
                achieved_rank: formData.get('achievedRank'),
                instructor_rank: formData.get('instructorRank'),
            },

        };
        try {
            if (payload.user_id) {
                await api.updateMember(payload.user_id, payload);
                showToast('Member updated successfully.', 'success');
            } else {
                console.log(payload);
                await api.createMember(payload);
                showToast('Member added successfully.', 'success');
            }

            memberModal.hide();
            loadMembers();
        } catch (error) {
            showToast(error.message || 'Failed to save member.', 'danger');
        }
    };

    // Sortowanie nagłówków tabeli
    const attachSortingToHeaders = () => {
        const headers = tableHeaders.querySelectorAll('.sortable');

        headers.forEach((header, index) => {
            // Dodaj ikony sortowania do nagłówków
            let sortIcon = header.querySelector('.sort-icon');
            if (!sortIcon) {
                sortIcon = document.createElement('span');
                sortIcon.className = 'sort-icon';
                header.appendChild(sortIcon);
            }

            // Domyślne sortowanie dla pierwszej kolumny
            if (index === 0 && !sortColumn) {
                sortColumn = `td:nth-child(1)`;
                sortDirection = 1;
                sortIcon.textContent = '▲';
            }

            // Obsługa kliknięcia w nagłówki
            header.addEventListener('click', () => {
                const columnSelector = `td:nth-child(${index + 1})`;

                if (sortColumn === columnSelector) {
                    sortDirection *= -1; // Zmień kierunek sortowania
                } else {
                    sortColumn = columnSelector;
                    sortDirection = 1; // Domyślne rosnące sortowanie
                }

                // Zresetuj aktywne ikony
                headers.forEach(h => {
                    const icon = h.querySelector('.sort-icon');
                    if (icon) {
                        icon.textContent = '';
                    }
                });

                // Ustaw aktywną ikonę dla aktualnie sortowanego nagłówka
                sortIcon.textContent = sortDirection === 1 ? '▲' : '▼';

                // Wykonaj sortowanie
                sortTable(membersTableBody, columnSelector, sortDirection);
            });
        });
    };

    document.getElementById('addMemberBtn').addEventListener('click', resetForm);
    await loadMembers();
});
