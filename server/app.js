const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dashboardRoutes = require('./modules/dashboard/dashboard.routes');
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/users.routes');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use(express.static(path.join(__dirname, '../client/dist')));

// Client Pages
app.get('/', (req, res) => res.redirect('/auth'));
app.get('/dashboard', (req, res) =>
    res.sendFile(path.join(__dirname, '../client/dist/dashboard.html'))
);
app.get('/users', (req, res) =>
    res.sendFile(path.join(__dirname, '../client/dist/users.html'))
);
app.get('/auth', (req, res) =>
    res.sendFile(path.join(__dirname, '../client/dist/login.html'))
);

// Error Handling
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        console.error(error.stack); // Logowanie szczegółów w trybie dev
    }

    res.status(error.status || 500).json({
        error: {
            message: error.message,
        },
    });
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
