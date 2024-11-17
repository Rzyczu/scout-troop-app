// server/app.js
const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Datastore = require('nedb');
const app = express();
app.use(express.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const JWT_SECRET = 'supersecretkey';

// Enums
const UserRoles = {
    DRUZYNOWY: 'Drużynowy',
    PRZYBOCZNY: 'Przyboczny',
    ZASTĘPOWY: 'Zastępowy'
};

const ScoutFunctions = {
    ZASTĘPOWY: 'Zastępowy',
    PODZASTĘPOWY: 'Podzastępowy',
    DRUZYNOWY: 'Drużynowy',
    PRZYBOCZNY: 'Przyboczny'
};

const ScoutRanks = {
    NONE: { short: '', full: 'None' },
    ML: { short: 'mł.', full: 'Młodzik' },
    WYW: { short: 'wyw.', full: 'Wywiadowca' },
    CW: { short: 'ćw.', full: 'Ćwik' },
    HO: { short: 'HO.', full: 'Harcerz Orli' },
    HR: { short: 'HR', full: 'Harcerz Rzeczypospolitej' }
};

const InstructorRanks = {
    NONE: { short: '', full: 'None' },
    PWD: { short: 'pwd.', full: 'Przewodnik' },
    PHM: { short: 'phm.', full: 'Podharcmistrz' },
    HM: { short: 'hm.', full: 'Harcmistrz' }
};

// Databases
const userDb = new Datastore({ filename: path.join(__dirname, 'db/users.db'), autoload: true });
const troopDb = new Datastore({ filename: path.join(__dirname, 'db/troop.db'), autoload: true });
const personalDataDb = new Datastore({ filename: path.join(__dirname, 'db/personalData.db'), autoload: true });
const scoutInfoDb = new Datastore({ filename: path.join(__dirname, 'db/scoutInfo.db'), autoload: true });

// Auto-incrementing PK for personalData
let personalDataCounter = 0;
personalDataDb.find({}).sort({ _id: -1 }).limit(1).exec((err, docs) => {
    if (!err && docs.length > 0) {
        personalDataCounter = docs[0]._id || 0;
    }
});

// Static files
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(express.static(path.join(__dirname, '../client/src')));

// Initialize default admin user
const initializeAdminUser = async () => {
    const admin = {
        username: 'admin',
        password: await bcrypt.hash('admin', 10),
        email: 'admin@admin.adm',
        role: UserRoles.DRUZYNOWY,
        troopId: null
    };
    userDb.findOne({ username: admin.username }, (err, user) => {
        if (!user) userDb.insert(admin, (err) => err && console.error('Admin user creation error:', err));
    });
};
initializeAdminUser();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = req.cookies.token || (req.headers['authorization']
        ? req.headers['authorization'].split(' ')[1]
        : null);
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

// Authorization middleware
const authorize = (roles) => (req, res, next) => {
    console.log('Rola użytkownika:', req.user.role);
    if (!roles.includes(req.user.role)) {
        console.log('Brak uprawnień, zwracam 403');
        return res.status(403).json({ error: 'Access denied' });
    }
    next();
};

app.use((req, res, next) => {
    console.log(`Żądanie: ${req.method} ${req.url}`);
    next();
});

// Route: HTML pages
app.get('/', (req, res) => res.redirect('/login'));
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/src/pages/dashboard.html'));
});
app.get('/members', authenticateToken, authorize([UserRoles.DRUZYNOWY, UserRoles.PRZYBOCZNY]), (req, res) => {
    console.log('Ładowanie pliku members.html');
    res.sendFile(path.join(__dirname, '../client/src/pages/members.html'))
});
app.get('/users', authenticateToken, authorize([UserRoles.DRUZYNOWY]), (req, res) => res.sendFile(path.join(__dirname, '../client/src/pages/users.html')));
app.get('/members', authenticateToken, authorize([UserRoles.DRUZYNOWY, UserRoles.PRZYBOCZNY]), (req, res) => res.sendFile(path.join(__dirname, '../client/src/pages/members.html')));
app.get('/troops', authenticateToken, (req, res) => res.sendFile(path.join(__dirname, '../client/src/pages/troops.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, '../client/src/login.html')));

// API: Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    userDb.findOne({ username }, async (err, user) => {
        if (err || !user) return res.status(400).json({ error: 'Invalid credentials' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user._id, role: user.role, troopId: user.troopId },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // Zmień na true w produkcji (HTTPS)
            sameSite: 'strict'
        });

        res.json({ success: true, token });
    });
});

// API: Dashboard
app.get('/api/dashboard', authenticateToken, (req, res) => {
    // Przykładowe dane dashboardu
    const dashboardData = {
        message: `Witaj ${req.user.role}!`,
        troopId: req.user.troopId || null
    };
    res.json(dashboardData);
});

// API: Users
app.get('/api/users', authenticateToken, authorize([UserRoles.DRUZYNOWY]), (req, res) => {
    userDb.find({}, (err, users) => {
        if (err) return res.status(500).json({ error: 'Database fetch error' });
        res.json(users);
    });
});
app.post('/api/users', authenticateToken, authorize([UserRoles.DRUZYNOWY]), async (req, res) => {
    const { username, password, email, role } = req.body;
    const newUser = { username, password: await bcrypt.hash(password, 10), email, role };
    userDb.insert(newUser, (err, user) => res.status(err ? 500 : 201).json(err ? { error: 'Database insertion error' } : user));
});
app.delete('/api/users/:id', authenticateToken, authorize([UserRoles.DRUZYNOWY]), (req, res) => {
    userDb.remove({ _id: req.params.id }, {}, (err) => res.json(err ? { error: 'Database deletion error' } : { success: true }));
});

// API: Members - Personal Data
// API: Add Member
app.post('/api/members', authenticateToken, authorize([UserRoles.DRUZYNOWY, UserRoles.PRZYBOCZNY]), (req, res) => {
    const { firstName, lastName, birthYear, email, function: scoutFunction, rankOpen, rankAchieved, instructorRank } = req.body;

    // Create `personalData` entry
    const newPersonalData = {
        _id: ++personalDataCounter, // Auto-incrementing ID
        firstName,
        lastName,
        birthYear,
        email
    };

    personalDataDb.insert(newPersonalData, (err, insertedPersonalData) => {
        if (err) return res.status(500).json({ error: 'Failed to save personal data' });

        // Create `scoutInfo` entry using the ID from `personalData`
        const newScoutInfo = {
            personalDataId: insertedPersonalData._id,
            function: scoutFunction,
            rankOpen,
            rankAchieved,
            instructorRank
        };

        scoutInfoDb.insert(newScoutInfo, (err, insertedScoutInfo) => {
            if (err) return res.status(500).json({ error: 'Failed to save scout info' });

            res.status(201).json({ personalData: insertedPersonalData, scoutInfo: insertedScoutInfo });
        });
    });
});

// API: Update Member
app.put('/api/members/:id', authenticateToken, authorize([UserRoles.DRUZYNOWY, UserRoles.PRZYBOCZNY]), (req, res) => {
    const memberId = parseInt(req.params.id, 10);
    const { firstName, lastName, birthYear, email, function: scoutFunction, rankOpen, rankAchieved, instructorRank } = req.body;

    // Update `personalData`
    personalDataDb.update(
        { _id: memberId },
        { $set: { firstName, lastName, birthYear, email } },
        {},
        (err) => {
            if (err) return res.status(500).json({ error: 'Failed to update personal data' });

            // Update `scoutInfo`
            scoutInfoDb.update(
                { personalDataId: memberId },
                { $set: { function: scoutFunction, rankOpen, rankAchieved, instructorRank } },
                {},
                (err) => {
                    if (err) return res.status(500).json({ error: 'Failed to update scout info' });

                    res.status(200).json({ message: 'Member updated successfully' });
                }
            );
        }
    );
});

// API: Fetch Members with Join
app.get('/api/members', authenticateToken, authorize([UserRoles.DRUZYNOWY, UserRoles.PRZYBOCZNY]), (req, res) => {
    personalDataDb.find({}, (err, personalData) => {
        if (err) return res.status(500).json({ error: 'Database fetch error' });

        scoutInfoDb.find({}, (err, scoutInfo) => {
            if (err) return res.status(500).json({ error: 'Database fetch error' });

            // Merge data
            const mergedData = personalData.map((data) => {
                const scoutData = scoutInfo.find(info => info.personalDataId === data._id);
                return { ...data, ...scoutData };
            });

            res.json(mergedData);
        });
    });
});

// API: Delete Member
app.delete('/api/members/:id', authenticateToken, authorize([UserRoles.DRUZYNOWY, UserRoles.PRZYBOCZNY]), (req, res) => {
    const memberId = parseInt(req.params.id, 10);

    personalDataDb.remove({ _id: memberId }, {}, (err) => {
        if (err) return res.status(500).json({ error: 'Failed to delete personal data' });

        scoutInfoDb.remove({ personalDataId: memberId }, {}, (err) => {
            if (err) return res.status(500).json({ error: 'Failed to delete scout info' });

            res.json({ success: true });
        });
    });
});

// API: Troops
app.get('/api/troops', authenticateToken, (req, res) => {
    const query = req.user.role === UserRoles.ZASTĘPOWY ? { _id: req.user.troopId } : {};
    troopDb.find(query, (err, troops) => res.json(err ? { error: 'Database fetch error' } : troops));
});
app.post('/api/troops', authenticateToken, authorize([UserRoles.DRUZYNOWY, UserRoles.PRZYBOCZNY]), (req, res) => {
    const newTroop = { name: req.body.name, description: req.body.description, color: req.body.color, song: req.body.song, points: 0, members: [] };
    troopDb.insert(newTroop, (err, troop) => res.status(err ? 500 : 201).json(err ? { error: 'Database insertion error' } : troop));
});
app.delete('/api/troops/:id', authenticateToken, authorize([UserRoles.DRUZYNOWY, UserRoles.PRZYBOCZNY]), (req, res) => {
    troopDb.remove({ _id: req.params.id }, {}, (err) => res.json(err ? { error: 'Database deletion error' } : { success: true }));
});

// API: Members (Scouts within Troops)
app.get('/api/members', authenticateToken, authorize([UserRoles.DRUZYNOWY, UserRoles.PRZYBOCZNY]), (req, res) => {
    scoutInfoDb.find({}, (err, members) => res.json(err ? { error: 'Database fetch error' } : members));
});
app.post('/api/members', authenticateToken, authorize([UserRoles.DRUZYNOWY, UserRoles.PRZYBOCZNY]), (req, res) => {
    const newMember = {
        function: req.body.function,
        rankOpen: req.body.rankOpen,
        rankAchieved: req.body.rankAchieved,
        personalDataId: req.body.personalDataId
    };
    scoutInfoDb.insert(newMember, (err, member) => res.status(err ? 500 : 201).json(err ? { error: 'Database insertion error' } : member));
});
app.delete('/api/members/:id', authenticateToken, authorize([UserRoles.DRUZYNOWY, UserRoles.PRZYBOCZNY]), (req, res) => {
    scoutInfoDb.remove({ _id: req.params.id }, {}, (err) => res.json(err ? { error: 'Database deletion error' } : { success: true }));
});

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
