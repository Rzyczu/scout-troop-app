import { mapEnumFullName, ScoutFunctions, ScoutRanks, InstructorRanks } from "../../../utils/enums";

const viewConfig = {
    basic: [
        { key: 'name', label: 'Name' },
        { key: 'surname', label: 'Surname' },
        { key: 'date_birth', label: 'Date of Birth', formatter: (value) => new Date(value).toLocaleDateString() }
    ],
    contact: [
        { key: 'name', label: 'Name' },
        { key: 'surname', label: 'Surname' },
        { key: 'phone_number', label: 'Phone Number' },
        { key: 'mother_phone_number', label: "Mother's Phone Number" },
        { key: 'father_phone_number', label: "Father's Phone Number" },
        { key: 'parent_email_1', label: 'Email 1' },
        { key: 'parent_email_2', label: 'Email 2' }
    ],
    scout: [
        { key: 'name', label: 'Name' },
        { key: 'surname', label: 'Surname' },
        { key: 'troop_name', label: 'Troop' },
        { key: 'function', label: 'Function', formatter: (value, gender) => mapEnumFullName(ScoutFunctions, value, gender) || '-' },
        { key: 'open_rank', label: 'Open Rank', formatter: (value, gender) => mapEnumFullName(ScoutRanks, value, gender) || '-' },
        { key: 'achieved_rank', label: 'Achieved Rank', formatter: (value, gender) => mapEnumFullName(ScoutRanks, value, gender) || '-' },
        { key: 'instructor_rank', label: 'Instructor Rank', formatter: (value, gender) => mapEnumFullName(InstructorRanks, value, gender) || '-' }
    ]
};

export const filterMembersByView = (members, view, gender, useUnderscore = false) => {
    const formatKey = (key) => {
        return useUnderscore ? key.replace(/ /g, '_') : key;
    };

    return members.map((member, index) => {
        const processedMember = {
            ID: index + 1,
        };

        switch (view) {
            case "basic":
                processedMember[formatKey("Name")] = member.name;
                processedMember[formatKey("Surname")] = member.surname;
                processedMember[formatKey("Date of Birth")] = new Date(member.date_birth).toLocaleDateString();
                break;

            case "contact":
                processedMember[formatKey("Name")] = member.name;
                processedMember[formatKey("Surname")] = member.surname;
                processedMember[formatKey("Phone Number")] = member.phone_number || "-";
                processedMember[formatKey("Mother's Number")] = member.mother_phone_number || "-";
                processedMember[formatKey("Father's Number")] = member.father_phone_number || "-";
                processedMember[formatKey("Phone Number")] = member.phone_number || "-";
                processedMember[formatKey("Parent Email 1")] = member.parent_email_1 || "-";
                processedMember[formatKey("Parent Email 2")] = member.parent_email_2 || "-";
                break;

            case "scout":
                processedMember[formatKey("Name")] = member.name;
                processedMember[formatKey("Surname")] = member.surname;
                processedMember[formatKey("Troop")] = member.troop_name || '';
                processedMember[formatKey("Function")] = mapEnumFullName(ScoutFunctions, member.function, gender) || '-';
                processedMember[formatKey("Open Rank")] = mapEnumFullName(ScoutRanks, member.open_rank, gender) || "-";
                processedMember[formatKey("Achieved Rank")] = mapEnumFullName(ScoutRanks, member.achieved_rank, gender) || "-";
                processedMember[formatKey("Instructor Rank")] = mapEnumFullName(InstructorRanks, member.instructor_rank, gender) || "-";
                break;

            default: // Full data view
                processedMember[formatKey("Name")] = member.name;
                processedMember[formatKey("Surname")] = member.surname;
                processedMember[formatKey("Date of Birth")] = new Date(member.date_birth).toLocaleDateString();
                processedMember[formatKey("Phone Number")] = member.phone_number || "-";
                processedMember[formatKey("Mother's Number")] = member.mother_phone_number || "-";
                processedMember[formatKey("Father's Number")] = member.father_phone_number || "-";
                processedMember[formatKey("Parent Email 1")] = member.parent_email_1 || "-";
                processedMember[formatKey("Parent Email 2")] = member.parent_email_2 || "-";
                processedMember[formatKey("Troop")] = member.troop_name || '';
                processedMember[formatKey("Function")] = mapEnumFullName(ScoutFunctions, member.function, gender) || '-';
                processedMember[formatKey("Open Rank")] = mapEnumFullName(ScoutRanks, member.open_rank, gender) || "-";
                processedMember[formatKey("Achieved Rank")] = mapEnumFullName(ScoutRanks, member.achieved_rank, gender) || "-";
                processedMember[formatKey("Instructor Rank")] = mapEnumFullName(InstructorRanks, member.instructor_rank, gender) || "-";
                break;
        }

        return processedMember;
    });
};

export const updateActiveViewButton = (currentView) => {
    if (!currentView) {
        showToast('No valid view selected for updateActiveViewButton.', 'warning'); return;
    }

    document.querySelectorAll('.view-btn').forEach((btn) => {
        btn.classList.remove('active');
    });

    const activeBtn = document.getElementById(`view${currentView.charAt(0).toUpperCase() + currentView.slice(1)}`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    } else {
        showToast(`No button found for current view: ${currentView}`, 'warning');
    }
};

export const getTableHeaders = (view) => {
    const columns = viewConfig[view] || [];
    const headers = columns.map(col => `<th>${col.label}</th>`).join('');
    return `
        <th data-sort="id">ID</th>
        ${headers}
        <th>Actions</th>
    `;
};

export const renderTableRow = (member, index, view, gender) => {
    const columns = viewConfig[view] || [];
    const rowCells = columns.map(col => {
        const value = member[col.key] || '-';
        return `<td>${col.formatter ? col.formatter(value, gender) : value}</td>`;
    }).join('');

    return `
        <tr>
            <td>${index}</td>
            ${rowCells}
            <td>
                <button class="btn btn-secondary btn-sm editMemberBtn" data-id="${member.user_id}">Edit</button>
                <button class="btn btn-danger btn-sm deleteMemberBtn" data-id="${member.user_id}">Delete</button>
            </td>
        </tr>
    `;
};