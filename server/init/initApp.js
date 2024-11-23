const initializeDatabase = require('./initializeDatabase');
const addAdminUser = require('./addAdminUser');
const addUser1 = require('./addUser1');

const initApp = async () => {
    console.log('initApp started');
    await initializeDatabase();
    await addAdminUser();
    await addUser1();
};

module.exports = initApp;
