import { mapEnumFullName, ScoutFunctions, ScoutRanks, InstructorRanks } from "../../../utils/enums";
import headersConfig from '../config/headers.js';

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
    return headersConfig[view].map(header =>
        `<th data-key="${header.key || ''}">${header.label}</th>`
    ).join('');
};

export const renderTableRow = (member, _, view, gender) => {
    const columns = headersConfig[view] || [];
    const rowClass = member.rankAdequacy;
    const rowCells = columns
        .filter(col => col.key)
        .map(col => {
            const value = member[col.key] || '-';
            return `<td data-key="${col.key}">${col.formatter ? col.formatter(value, gender) : value}</td>`;
        })
        .join('');

    return `
    <tr data-rank-adequacy="${member.rankAdequacy}">
        <td class="dynamic-id"></td>
        ${rowCells}
        <td>
            <button class="btn btn-secondary btn-sm editMemberBtn" data-id="${member.user_id}">Edit</button>
            <button class="btn btn-danger btn-sm deleteMemberBtn" data-id="${member.user_id}">Delete</button>
        </td>
    </tr>
    `;
};
