import { mapEnumFullName, ScoutFunctions, ScoutRanks, InstructorRanks } from "../../../utils/enums";

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
    switch (view) {
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
                <th>Mother's Phone Number</th>
                <th>Father's Phone Number</th>
                <th>Email 1</th>
                <th>Email 2</th>
                <th>Actions</th>`;
        case 'scout':
            return `
                <th data-sort="id">ID</th>
                <th>Name</th>
                <th>Surname</th>
                <th>Troop</th>
                <th>Function</th>
                <th>Open Rank</th>
                <th>Achieved Rank</th>
                <th>Instructor Rank</th>
                <th>Actions</th>`;
        default:
            return ''; // Default headers if view is invalid
    }
};

export const renderTableRow = (member, index, view, gender) => {
    const { user_id, name, surname, date_birth, phone_number, mother_phone_number, father_phone_number, parent_email_1, parent_email_2, troop_name, function: scoutFunction, open_rank, achieved_rank, instructor_rank } = member;
    switch (view) {
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
                    <td>${mother_phone_number || '-'}</td>
                    <td>${father_phone_number || '-'}</td>
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
                    <td>${troop_name || ''}</td>
                    <td>${mapEnumFullName(ScoutFunctions, scoutFunction, gender) || '-'}</td>
                    <td>${mapEnumFullName(ScoutRanks, open_rank, gender) || '-'}</td>
                    <td>${mapEnumFullName(ScoutRanks, achieved_rank, gender) || '-'}</td>
                    <td>${mapEnumFullName(InstructorRanks, instructor_rank, gender) || '-'}</td>
                    <td>
                        <button class="btn btn-secondary btn-sm editMemberBtn" data-id="${user_id}">Edit</button>
                        <button class="btn btn-danger btn-sm deleteMemberBtn" data-id="${user_id}">Delete</button>
                    </td>
                </tr>`;
        default:
            return ''; // Empty row if view is invalid
    }
};
