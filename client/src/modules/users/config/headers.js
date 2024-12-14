const headersConfig = [
    { label: 'ID', sortable: false },
    { label: 'Name', sortable: true, key: 'name' },
    { label: 'Surname', sortable: true, key: 'surname' },
    { label: 'Email', sortable: true, key: 'email' },
    { label: 'Function', sortable: true, key: 'function', formatter: (value, gender) => mapEnumFullName(ScoutFunctions, value, gender) || '-' },
    { label: 'Actions', sortable: false },
];

export default headersConfig;
