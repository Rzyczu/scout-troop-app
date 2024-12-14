const headersConfig = {
    basic: [
        { label: 'ID', sortable: false },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'surname', label: 'Surname', sortable: true },
        { key: 'date_birth', label: 'Date of Birth', formatter: (value) => new Date(value).toLocaleDateString(), sortable: true },
        { label: 'Actions', sortable: false },
    ],
    contact: [
        { label: 'ID', sortable: false },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'surname', label: 'Surname', sortable: true },
        { key: 'phone_number', label: 'Phone Number', sortable: true },
        { key: 'mother_phone_number', label: "Mother's Phone Number", sortable: true },
        { key: 'father_phone_number', label: "Father's Phone Number", sortable: true },
        { key: 'parent_email_1', label: 'Email 1', sortable: true },
        { key: 'parent_email_2', label: 'Email 2', sortable: true },
        { label: 'Actions', sortable: false },
    ],
    scout: [
        { label: 'ID', sortable: false },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'surname', label: 'Surname', sortable: true },
        { key: 'troop_name', label: 'Troop', sortable: true },
        { key: 'function', label: 'Function', formatter: (value, gender) => mapEnumFullName(ScoutFunctions, value, gender) || '-', sortable: true },
        { key: 'open_rank', label: 'Open Rank', formatter: (value, gender) => mapEnumFullName(ScoutRanks, value, gender) || '-', sortable: true },
        { key: 'achieved_rank', label: 'Achieved Rank', formatter: (value, gender) => mapEnumFullName(ScoutRanks, value, gender) || '-', sortable: true },
        { key: 'instructor_rank', label: 'Instructor Rank', formatter: (value, gender) => mapEnumFullName(InstructorRanks, value, gender) || '-', sortable: true },
        { label: 'Actions', sortable: false },
    ]
};

export default headersConfig;
