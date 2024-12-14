const headersConfig = [
    { label: 'ID', sortable: false },
    { label: 'Name', sortable: true, key: 'name' },
    { label: 'Leader', sortable: true, key: 'leader', formatter: (leader) => leader ? `${leader.name} ${leader.surname}` : '-' },
    { label: 'Actions', sortable: false },
];

export default headersConfig;
