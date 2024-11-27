export const filterMembersByView = (members, view, useUnderscore = false) => {
    const formatKey = (key) => {
        return useUnderscore ? key.replace(/ /g, '_') : key;
    };

    return members.map((member, index) => {
        const processedMember = {
            ID: index + 1,
        };

        switch (view) {
            case 'basic':
                processedMember[formatKey('Name')] = member.name;
                processedMember[formatKey('Surname')] = member.surname;
                processedMember[formatKey('Date of Birth')] = new Date(member.date_birth).toLocaleDateString();
                break;

            case 'contact':
                processedMember[formatKey('Name')] = member.name;
                processedMember[formatKey('Surname')] = member.surname;
                processedMember[formatKey('Phone Number')] = member.phone_number || '-';
                processedMember[formatKey('Parent Email 1')] = member.parent_email_1 || '-';
                processedMember[formatKey('Parent Email 2')] = member.parent_email_2 || '-';
                break;

            case 'scout':
                processedMember[formatKey('Name')] = member.name;
                processedMember[formatKey('Surname')] = member.surname;
                processedMember[formatKey('Function')] = ScoutFunctions[member.function] || '-';
                processedMember[formatKey('Open Rank')] = ScoutRanks[member.open_rank]?.full || '-';
                processedMember[formatKey('Achieved Rank')] = ScoutRanks[member.achieved_rank]?.full || '-';
                processedMember[formatKey('Instructor Rank')] = InstructorRanks[member.instructor_rank]?.full || '-';
                break;

            default: // Full data view
                processedMember[formatKey('Name')] = member.name;
                processedMember[formatKey('Surname')] = member.surname;
                processedMember[formatKey('Date of Birth')] = new Date(member.date_birth).toLocaleDateString();
                processedMember[formatKey('Phone Number')] = member.phone_number || '-';
                processedMember[formatKey('Parent Email 1')] = member.parent_email_1 || '-';
                processedMember[formatKey('Parent Email 2')] = member.parent_email_2 || '-';
                processedMember[formatKey('Function')] = ScoutFunctions[member.function] || '-';
                processedMember[formatKey('Open Rank')] = ScoutRanks[member.open_rank]?.full || '-';
                processedMember[formatKey('Achieved Rank')] = ScoutRanks[member.achieved_rank]?.full || '-';
                processedMember[formatKey('Instructor Rank')] = InstructorRanks[member.instructor_rank]?.full || '-';
                break;
        }

        return processedMember;
    });
};

export const updateActiveViewButton = (currentView) => {
    if (!currentView) {
        showToast('No valid view selected for updateActiveViewButton.', 'warning');
        console.warn('No valid view selected for updateActiveViewButton.');
        return;
    }

    document.querySelectorAll('.view-btn').forEach((btn) => {
        btn.classList.remove('active');
    });

    const activeBtn = document.getElementById(`view${currentView.charAt(0).toUpperCase() + currentView.slice(1)}`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    } else {
        showToast(`No button found for current view: ${currentView}`, 'warning');
        console.warn(`No button found for current view: ${currentView}`);
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
        default:
            return ''; // Default headers if view is invalid
    }
};

export const renderTableRow = (member, index, view) => {
    const { user_id, name, surname, date_birth, phone_number, parent_email_1, parent_email_2, function: scoutFunction, open_rank, achieved_rank, instructor_rank } = member;

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
                    <td>${ScoutRanks[achieved_rank]?.full || '-'}</td>
                    <td>${InstructorRanks[instructor_rank]?.full || '-'}</td>
                    <td>
                        <button class="btn btn-secondary btn-sm editMemberBtn" data-id="${user_id}">Edit</button>
                        <button class="btn btn-danger btn-sm deleteMemberBtn" data-id="${user_id}">Delete</button>
                    </td>
                </tr>`;
        default:
            return ''; // Empty row if view is invalid
    }
};
