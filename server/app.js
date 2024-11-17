const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const cookieParser = require('cookie-parser');
const { UserRoles, ScoutFunctions, ScoutRanks, InstructorRanks, mapEnum } = require('./enums');

const app = express();
app.use(express.json());
app.use(cookieParser());

// PostgreSQL Configuration
const dbConfig = {
    user: 'postgres.tyqwqeqmzxpzuucjywjr',
    host: 'aws-0-eu-central-1.pooler.supabase.com',
    database: 'postgres',
    password: 'qZQbVq*GC.27XQU',
    port: 6543,
};
const pool = new Pool(dbConfig);

// JWT Secret
const JWT_SECRET = 'supersecretkey';

// Map member data for client-friendly representation
const mapMemberData = (member) => ({
    ...member,
    role: mapEnum(UserRoles, member.role).full,
    function: mapEnum(ScoutFunctions, member.function).full,
    rankOpen: mapEnum(ScoutRanks, member.rankOpen).full,
    rankAchieved: mapEnum(ScoutRanks, member.rankAchieved).full,
    instructorRank: mapEnum(InstructorRanks, member.instructorRank).full,
});

// Utility to map to enum key
const mapToKey = (enumType, value) =>
    Object.keys(enumType).find(key => enumType[key] === value) || value;

// Initialize admin user in the database
const initializeAdminUser = async () => {
    const admin = {
        username: 'admin',
        password: await bcrypt.hash('admin', 10), // Hash the admin password here
        email: 'admin@admin.adm',
        role: 1, // Drużynowy
    };

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [admin.username]);
        if (result.rows.length === 0) {
            // Insert admin user with hashed password
            await pool.query(
                'INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, $4)',
                [admin.username, admin.password, admin.email, admin.role]
            );
            console.log('Admin user initialized');
        } else {
            console.log('Admin user already exists.');
        }
    } catch (err) {
        console.error('Error initializing admin user:', err.message);
    }
};
initializeAdminUser();

// Middleware for authentication
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token || (req.headers.authorization?.split(' ')[1] || null);
    if (!token) {
        return res.status(401).json({ error: 'Access denied, token missing or invalid format' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};


// Middleware for authorization
const authorize = (roles) => (req, res, next) => {
    const userRole = parseInt(req.user.role, 10); // Convert role to integer if stored as number
    if (!roles.includes(userRole)) {
        return res.status(403).json({ error: 'Access denied' });
    }
    next();
};

// Middleware for logging
app.use((req, res, next) => {
    console.log(`Request: ${req.method} ${req.url}`);
    next();
});

// Static files
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(express.static(path.join(__dirname, '../client/src')));

// Routes
app.get('/', (req, res) => res.redirect('/login'));
app.get('/dashboard', authenticateToken, (req, res) =>
    res.sendFile(path.join(__dirname, '../client/src/pages/dashboard.html'))
);
app.get('/members', authenticateToken, authorize([1, 2]), (req, res) =>
    res.sendFile(path.join(__dirname, '../client/src/pages/members.html'))
);
app.get('/users', authenticateToken, authorize([1]), (req, res) =>
    res.sendFile(path.join(__dirname, '../client/src/pages/users.html'))
);
app.get('/login', (req, res) =>
    res.sendFile(path.join(__dirname, '../client/src/login.html'))
);

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        console.log('Attempting login for username:', username);

        const result = await pool.query('SELECT id, password, role FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (!user) {
            console.error('No user found for username:', username);
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.error('Invalid password for username:', username);
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
        });

        console.log('User logged in successfully:', username);

        res.json({ success: true, role: mapEnum(UserRoles, user.role) });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ error: 'Database error' });
    }
});


// API: Dashboard
app.get('/api/dashboard', authenticateToken, (req, res) => {
    try {
        // Example data for the dashboard
        const dashboardData = {
            message: `Witaj ${mapEnum(UserRoles, req.user.role).full}!`,
            troopId: req.user.troopId || null, // Example field
        };
        res.json(dashboardData);
    } catch (err) {
        console.error('Error fetching dashboard data:', err);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

// API: Users
// API: Fetch all users
app.get('/api/users', authenticateToken, authorize([1]), async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT u.id, u.username, u.email, u.role, t.name as troop
            FROM users u
            LEFT JOIN troops t ON u.troop_id = t.id
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// API: Create a new user
app.post('/api/users', authenticateToken, authorize([1]), async (req, res) => {
    const { username, email, password, role, troop } = req.body;

    if (!password) {
        return res.status(400).json({ error: 'Password is required for new users' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(`
            INSERT INTO users (username, email, password, role, troop_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        `, [username, email, hashedPassword, role, troop || null]);

        res.status(201).json({ success: true, id: result.rows[0].id });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Failed to create user' });
    }
});


// API: Update a user
app.put('/api/users/:id', authenticateToken, authorize([1]), async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const { username, email, role, troop, password } = req.body;

    try {
        // Podstawowe zapytanie bez zmiany hasła
        const baseQuery = `
            UPDATE users 
            SET username = $1, email = $2, role = $3, troop_id = $4
            WHERE id = $5
        `;

        const baseValues = [username, email, role, troop || null, userId];

        if (password) {
            // Hasło zostało podane - aktualizuj hasło
            const hashedPassword = await bcrypt.hash(password, 10);
            await pool.query(
                `${baseQuery}, password = $6`,
                [...baseValues, hashedPassword]
            );
        } else {
            // Hasło nie zostało podane - nie zmieniaj hasła
            await pool.query(baseQuery, baseValues);
        }

        res.json({ success: true });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ error: 'Failed to update user' });
    }
});


// API: Delete a user
app.delete('/api/users/:id', authenticateToken, authorize([1]), async (req, res) => {
    const userId = parseInt(req.params.id, 10);

    try {
        await pool.query('DELETE FROM users WHERE id = $1', [userId]);
        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

app.get('/api/users/:id', authenticateToken, authorize([1]), async (req, res) => {
    const userId = parseInt(req.params.id, 10);

    try {
        // Pobierz użytkownika z bazy danych
        const result = await pool.query(`
            SELECT u.id, u.username, u.email, u.role, t.name as troop
            FROM users u
            LEFT JOIN troops t ON u.troop_id = t.id
            WHERE u.id = $1
        `, [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// API: Members
// Fetch all members with a specific view (personal data or scout info)
app.get('/api/members', authenticateToken, authorize([1, 2]), async (req, res) => {
    const view = req.query.view || 'personalData'; // Default to personal data view
    try {
        if (view === 'personalData') {
            const result = await pool.query(`
                SELECT pd.id, pd.first_name AS "firstName", pd.last_name AS "lastName", pd.birth_year AS "birthYear", 
                       pd.email, pd.phone_number AS "phoneNumber", pd.father_phone_number AS "fatherPhoneNumber", 
                       pd.mother_phone_number AS "motherPhoneNumber"
                FROM personal_data pd
            `);
            res.json(result.rows);
        } else if (view === 'scoutInfo') {
            const result = await pool.query(`
                SELECT pd.id, pd.first_name AS "firstName", pd.last_name AS "lastName", 
                       si.function, si.rank_open AS "rankOpen", si.rank_achieved AS "rankAchieved", 
                       si.instructor_rank AS "instructorRank"
                FROM scout_info si
                JOIN personal_data pd ON si.personal_data_id = pd.id
            `);
            res.json(result.rows);
        } else {
            res.status(400).json({ error: 'Invalid view type' });
        }
    } catch (err) {
        console.error('Error fetching members:', err);
        res.status(500).json({ error: 'Failed to fetch members' });
    }
});

// Fetch a single member by ID
app.get('/api/members/:id', authenticateToken, authorize([1, 2]), async (req, res) => {
    const memberId = parseInt(req.params.id, 10);
    try {
        const result = await pool.query(`
            SELECT pd.id, pd.first_name AS "firstName", pd.last_name AS "lastName", pd.birth_year AS "birthYear", 
                   pd.email, pd.phone_number AS "phoneNumber", pd.father_phone_number AS "fatherPhoneNumber", 
                   pd.mother_phone_number AS "motherPhoneNumber", si.function, si.rank_open AS "rankOpen", 
                   si.rank_achieved AS "rankAchieved", si.instructor_rank AS "instructorRank"
            FROM personal_data pd
            LEFT JOIN scout_info si ON pd.id = si.personal_data_id
            WHERE pd.id = $1
        `, [memberId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Member not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching member:', err);
        res.status(500).json({ error: 'Failed to fetch member' });
    }
});

// Add a new member
app.post('/api/members', authenticateToken, authorize([1, 2]), async (req, res) => {
    const {
        firstName, lastName, birthYear, email, phoneNumber, fatherPhoneNumber, motherPhoneNumber,
        scoutFunction, rankOpen, rankAchieved, instructorRank
    } = req.body;

    try {
        // Insert personal data
        const personalDataResult = await pool.query(`
            INSERT INTO personal_data (first_name, last_name, birth_year, email, phone_number, father_phone_number, mother_phone_number)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
        `, [firstName, lastName, birthYear, email, phoneNumber, fatherPhoneNumber, motherPhoneNumber]);

        const personalDataId = personalDataResult.rows[0].id;

        // Insert scout info if provided
        if (scoutFunction || rankOpen || rankAchieved || instructorRank) {
            await pool.query(`
                INSERT INTO scout_info (personal_data_id, function, rank_open, rank_achieved, instructor_rank)
                VALUES ($1, $2, $3, $4, $5)
            `, [personalDataId, scoutFunction, rankOpen, rankAchieved, instructorRank]);
        }

        res.status(201).json({ message: 'Member added successfully' });
    } catch (err) {
        console.error('Error adding member:', err);
        res.status(500).json({ error: 'Failed to add member' });
    }
});

// Update a member
app.put('/api/members/:id', authenticateToken, authorize([1, 2]), async (req, res) => {
    const memberId = parseInt(req.params.id, 10);
    const {
        firstName, lastName, birthYear, email, phoneNumber, fatherPhoneNumber, motherPhoneNumber,
        scoutFunction, rankOpen, rankAchieved, instructorRank
    } = req.body;

    try {
        // Update personal data
        await pool.query(`
            UPDATE personal_data
            SET first_name = $1, last_name = $2, birth_year = $3, email = $4, phone_number = $5, 
                father_phone_number = $6, mother_phone_number = $7
            WHERE id = $8
        `, [firstName, lastName, birthYear, email, phoneNumber, fatherPhoneNumber, motherPhoneNumber, memberId]);

        // Update scout info if provided
        if (scoutFunction || rankOpen || rankAchieved || instructorRank) {
            const result = await pool.query(`
                SELECT id FROM scout_info WHERE personal_data_id = $1
            `, [memberId]);

            if (result.rows.length > 0) {
                // Update existing scout info
                await pool.query(`
                    UPDATE scout_info
                    SET function = $1, rank_open = $2, rank_achieved = $3, instructor_rank = $4
                    WHERE personal_data_id = $5
                `, [scoutFunction, rankOpen, rankAchieved, instructorRank, memberId]);
            } else {
                // Insert new scout info
                await pool.query(`
                    INSERT INTO scout_info (personal_data_id, function, rank_open, rank_achieved, instructor_rank)
                    VALUES ($1, $2, $3, $4, $5)
                `, [memberId, scoutFunction, rankOpen, rankAchieved, instructorRank]);
            }
        }

        res.json({ message: 'Member updated successfully' });
    } catch (err) {
        console.error('Error updating member:', err);
        res.status(500).json({ error: 'Failed to update member' });
    }
});

// Delete a member
app.delete('/api/members/:id', authenticateToken, authorize([1, 2]), async (req, res) => {
    const memberId = parseInt(req.params.id, 10);

    try {
        await pool.query('DELETE FROM scout_info WHERE personal_data_id = $1', [memberId]);
        await pool.query('DELETE FROM personal_data WHERE id = $1', [memberId]);

        res.json({ message: 'Member deleted successfully' });
    } catch (err) {
        console.error('Error deleting member:', err);
        res.status(500).json({ error: 'Failed to delete member' });
    }
});

// API: Troops
app.get('/api/troops', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name FROM troops');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching troops:', err);
        res.status(500).json({ error: 'Failed to fetch troops' });
    }
});

// API: Roles
app.get('/api/roles', authenticateToken, (req, res) => {
    try {
        const roles = Object.entries(UserRoles).map(([id, name]) => ({ id, name }));
        res.json(roles);
    } catch (err) {
        console.error('Error fetching roles:', err);
        res.status(500).json({ error: 'Failed to fetch roles' });
    }
});

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
