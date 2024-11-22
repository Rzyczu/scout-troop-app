const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dashboardRoutes = require('./routes/dashboard');
const loginRoutes = require('./routes/login');
const userRoutes = require('./routes/users');
const memberRoutes = require('./routes/members');
const troopRoutes = require('./routes/troops');
const enumRoutes = require('./routes/enums');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(express.static(path.join(__dirname, '../client/src')));

// Routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/users', userRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/troops', troopRoutes);
app.use('/api/enums', enumRoutes);
// Client Pages
app.get('/', (req, res) => res.redirect('/login'));
app.get('/dashboard', (req, res) =>
    res.sendFile(path.join(__dirname, '../client/src/pages/dashboard.html'))
);
app.get('/members', (req, res) =>
    res.sendFile(path.join(__dirname, '../client/src/pages/members.html'))
);
app.get('/users', (req, res) =>
    res.sendFile(path.join(__dirname, '../client/src/pages/users.html'))
);
app.get('/login', (req, res) =>
    res.sendFile(path.join(__dirname, '../client/src/login.html'))
);

// Error Handling
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
});

module.exports = app;
