const headersConfig = [
    { label: 'ID', sortable: false, exportable: true, },
    { label: 'Name', sortable: true, exportable: true, key: 'name' },
    { label: 'Surname', sortable: true, exportable: true, key: 'surname' },
    { label: 'Email', sortable: true, exportable: true, key: 'email' },
    { label: 'Function', sortable: true, exportable: true, key: 'function', formatter: (value, gender) => mapEnumFullName(ScoutFunctions, value, gender) || '-' },
    { label: 'Actions', sortable: false, exportable: false, },
];

export default headersConfig;
