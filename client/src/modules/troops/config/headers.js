const headersConfig = [
    { label: 'ID', sortable: false },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'leader', label: 'Leader', formatter: (leader) => leader ? `${leader.name} ${leader.surname}` : '-', sortable: true },
    { label: 'Actions', sortable: false }
];
export default headersConfig;
