const headersConfig = {
    basic: [
        { label: 'ID', sortable: false },
        { label: 'Name', sortable: true, key: 'name' },
        { label: 'Surname', sortable: true, key: 'surname' },
        { label: 'Date of Birth', sortable: true, key: 'date_birth', formatter: (value) => new Date(value).toLocaleDateString() },
        { label: 'Actions', sortable: false },
    ],
    contact: [
        { label: 'ID', sortable: false },
        { label: 'Name', sortable: true, key: 'name' },
        { label: 'Surname', sortable: true, key: 'surname' },
        { label: 'Phone Number', sortable: true, key: 'phone_number' },
        { label: "Mother's Phone Number", sortable: true, key: 'mother_phone_number' },
        { label: "Father's Phone Number", sortable: true, key: 'father_phone_number' },
        { label: 'Email 1', sortable: true, key: 'parent_email_1' },
        { label: 'Email 2', sortable: true, key: 'parent_email_2' },
        { label: 'Actions', sortable: false },
    ],
    scout: [
        { label: 'ID', sortable: false },
        { label: 'Name', sortable: true, key: 'name' },
        { label: 'Surname', sortable: true, key: 'surname' },
        { label: 'Troop', sortable: true, key: 'troop_name' },
        { label: 'Function', sortable: true, key: 'function', formatter: (value, gender) => mapEnumFullName(ScoutFunctions, value, gender) || '-' },
        { label: 'Open Rank', sortable: true, key: 'open_rank', formatter: (value, gender) => mapEnumFullName(ScoutRanks, value, gender) || '-' },
        { label: 'Achieved Rank', sortable: true, key: 'achieved_rank', formatter: (value, gender) => mapEnumFullName(ScoutRanks, value, gender) || '-' },
        { label: 'Instructor Rank', sortable: true, key: 'instructor_rank', formatter: (value, gender) => mapEnumFullName(InstructorRanks, value, gender) || '-' },
        { label: 'Actions', sortable: false },
    ],
};

export default headersConfig;
