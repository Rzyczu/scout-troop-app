const headersConfig = [
    { label: 'ID', sortable: false },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'surname', label: 'Surname', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'function', label: 'Function', formatter: (value, gender) => mapEnumFullName(ScoutFunctions, value, gender) || '-', sortable: true },
    { label: 'Actions', sortable: false },
];

export default headersConfig;
