// app.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Datastore = require('nedb');
const app = express();
app.use(express.json());

const JWT_SECRET = 'supersecretkey'; // Klucz JWT do szyfrowania tokenów (zmień na bardziej bezpieczny klucz)

// Enum dla funkcji harcerskich
const ScoutFunctions = {
    ZASTĘPOWY: 'Zastępowy',
    PODZASTĘPOWY: 'Podzastępowy',
    DRUŻYNOWY: 'Drużynowy',
    PRZYBOCZNY: 'Przyboczny'
};

// Enum dla ról użytkownika
const UserRoles = {
    DRUZYNOWY: 'Drużynowy',
    PRZYBOCZNY: 'Przyboczny',
    ZASTĘPOWY: 'Zastępowy'
};

// Inicjalizacja baz danych
const userDb = new Datastore({ filename: 'server/db/users.db', autoload: true });
const troopDb = new Datastore({ filename: 'server/db/troop.db', autoload: true });
const personalDataDb = new Datastore({ filename: 'server/db/personalData.db', autoload: true });
const scoutInfoDb = new Datastore({ filename: 'server/db/scoutInfo.db', autoload: true });

// Dodawanie użytkownika drużynowego (tylko raz, przy starcie serwera)
const initializeAdminUser = async () => {
    const adminUsername = 'admin';
    const adminPassword = 'admin';
    const adminEmail = 'admin@admin.adm';

    // Sprawdzamy, czy użytkownik admin już istnieje
    userDb.findOne({ username: adminUsername }, async (err, user) => {
        if (err) return console.error('Database error:', err);

        // Jeśli użytkownik nie istnieje, tworzymy go
        if (!user) {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            const newUser = {
                username: adminUsername,
                password: hashedPassword,
                email: adminEmail,
                role: UserRoles.DRUZYNOWY, // Rola drużynowego
                troopId: null // Brak przypisania do konkretnego zastępu
            };

            userDb.insert(newUser, (err, user) => {
                if (err) return console.error('Error adding admin user:', err);
                console.log('Admin user created:', user);
            });
        } else {
            console.log('Admin user already exists');
        }
    });
};

// Wywołanie funkcji tworzącej użytkownika drużynowego przy starcie serwera
initializeAdminUser();

// Middleware do sprawdzania tokena JWT i ustawiania req.user
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: 'Access denied, token missing' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Middleware do autoryzacji na podstawie roli
const authorize = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Access denied, insufficient permissions' });
    }
    next();
};

// Rejestracja użytkownika (tylko dla drużynowego)
app.post('/register', authenticateToken, authorize([UserRoles.DRUZYNOWY]), async (req, res) => {
    const { username, password, email, role, troopId } = req.body;

    if (!Object.values(UserRoles).includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        username,
        password: hashedPassword,
        email,
        role,
        troopId: role === UserRoles.ZASTĘPOWY ? troopId : null
    };

    userDb.insert(newUser, (err, user) => {
        if (err) return res.status(500).json({ error: 'Database insertion error' });
        res.status(201).json({ success: true, user });
    });
});

// Logowanie użytkownika
app.post('/login', (req, res) => {
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

        res.json({ success: true, token });
    });
});

// Dodawanie zastępu (troop) z początkowymi punktami
app.post('/troop', authenticateToken, authorize([UserRoles.DRUZYNOWY, UserRoles.PRZYBOCZNY]), (req, res) => {
    const troop = {
        name: req.body.name,
        description: req.body.description,
        color: req.body.color,
        song: req.body.song,
        points: req.body.points || 0, // Wartość początkowa punktów
        members: [] // Lista ID uczestników, pusta na początku
    };
    troopDb.insert(troop, (err, newTroop) => {
        if (err) return res.status(500).json({ error: 'Database insertion error' });
        res.status(201).json({ success: true, troop: newTroop });
    });
});

// Dodawanie danych osobowych uczestnika (PersonalData)
app.post('/personalData', authenticateToken, authorize([UserRoles.DRUZYNOWY, UserRoles.PRZYBOCZNY]), (req, res) => {
    const personalData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        birthYear: req.body.birthYear,
        email: req.body.email || null,
        phone: req.body.phone,
        parentEmail: req.body.parentEmail
    };
    personalDataDb.insert(personalData, (err, newPersonalData) => {
        if (err) return res.status(500).json({ error: 'Database insertion error' });
        res.status(201).json({ success: true, personalData: newPersonalData });
    });
});

// Dodawanie informacji harcerskich uczestnika (ScoutInfo)
app.post('/scoutInfo', authenticateToken, authorize([UserRoles.DRUZYNOWY, UserRoles.PRZYBOCZNY]), (req, res) => {
    const scoutFunction = req.body.function;
    if (!Object.values(ScoutFunctions).includes(scoutFunction)) {
        return res.status(400).json({ error: 'Invalid function value' });
    }

    const scoutInfo = {
        function: scoutFunction || null,
        troopId: req.body.troopId || null,
        rankOpen: req.body.rankOpen,
        rankAchieved: req.body.rankAchieved,
        personalDataId: req.body.personalDataId
    };
    scoutInfoDb.insert(scoutInfo, (err, newScoutInfo) => {
        if (err) return res.status(500).json({ error: 'Database insertion error' });
        res.status(201).json({ success: true, scoutInfo: newScoutInfo });
    });
});

// Endpoint do edycji danych osobowych uczestnika
app.put('/personalData/:id', authenticateToken, authorize([UserRoles.DRUZYNOWY, UserRoles.PRZYBOCZNY]), (req, res) => {
    const updateData = req.body;
    personalDataDb.update({ _id: req.params.id }, { $set: updateData }, {}, (err, numUpdated) => {
        if (err) return res.status(500).json({ error: 'Database update error' });
        if (numUpdated === 0) return res.status(404).json({ error: 'PersonalData not found' });
        res.json({ success: true, message: 'PersonalData updated' });
    });
});

// Endpoint do edycji informacji harcerskich uczestnika
app.put('/scoutInfo/:id', authenticateToken, authorize([UserRoles.DRUZYNOWY, UserRoles.PRZYBOCZNY]), (req, res) => {
    const updateData = {};
    if (req.body.rankOpen) updateData.rankOpen = req.body.rankOpen;
    if (req.body.rankAchieved) updateData.rankAchieved = req.body.rankAchieved;
    if (req.body.function && Object.values(ScoutFunctions).includes(req.body.function)) {
        updateData.function = req.body.function;
    }

    scoutInfoDb.update({ _id: req.params.id }, { $set: updateData }, {}, (err, numUpdated) => {
        if (err) return res.status(500).json({ error: 'Database update error' });
        if (numUpdated === 0) return res.status(404).json({ error: 'ScoutInfo not found' });
        res.json({ success: true, message: 'ScoutInfo updated' });
    });
});

// Endpoint do edycji informacji o zastępie (description, color, song, points)
app.put('/troop/:id', authenticateToken, authorize([UserRoles.DRUZYNOWY, UserRoles.PRZYBOCZNY, UserRoles.ZASTĘPOWY]), (req, res) => {
    const updateData = {};
    if (req.body.description) updateData.description = req.body.description;
    if (req.body.color) updateData.color = req.body.color;
    if (req.body.song) updateData.song = req.body.song;
    if (req.body.points !== undefined) updateData.points = req.body.points;

    troopDb.update({ _id: req.params.id }, { $set: updateData }, {}, (err, numUpdated) => {
        if (err) return res.status(500).json({ error: 'Database update error' });
        if (numUpdated === 0) return res.status(404).json({ error: 'Troop not found' });
        res.json({ success: true, message: 'Troop updated' });
    });
});

// Usuwanie uczestnika z zastępu
app.post('/troop/:troopId/removeMember/:scoutInfoId', authenticateToken, authorize([UserRoles.DRUZYNOWY, UserRoles.PRZYBOCZNY]), (req, res) => {
    const { troopId, scoutInfoId } = req.params;

    // Aktualizacja obiektu Troop (usunięcie scoutInfoId z listy members)
    troopDb.update({ _id: troopId }, { $pull: { members: scoutInfoId } }, {}, (err, numUpdated) => {
        if (err) return res.status(500).json({ error: 'Removal error in Troop' });
        if (numUpdated === 0) return res.status(404).json({ error: 'Troop not found' });

        // Aktualizacja obiektu ScoutInfo (usunięcie troopId)
        scoutInfoDb.update({ _id: scoutInfoId }, { $set: { troopId: null } }, {}, (err) => {
            if (err) return res.status(500).json({ error: 'Removal error in ScoutInfo' });
            res.json({ success: true, message: 'Member removed from troop' });
        });
    });
});

// Usunięcie uczestnika (PersonalData i ScoutInfo)
app.delete('/deleteMember/:id', authenticateToken, authorize([UserRoles.DRUZYNOWY]), (req, res) => {
    const scoutInfoId = req.params.id;

    // Usunięcie obiektu ScoutInfo
    scoutInfoDb.findOne({ _id: scoutInfoId }, (err, scoutInfo) => {
        if (err || !scoutInfo) return res.status(404).json({ error: 'ScoutInfo not found' });

        scoutInfoDb.remove({ _id: scoutInfoId }, {}, (err) => {
            if (err) return res.status(500).json({ error: 'Deletion error in ScoutInfo' });

            // Usunięcie danych osobowych powiązanych z tym ScoutInfo
            personalDataDb.remove({ _id: scoutInfo.personalDataId }, {}, (err) => {
                if (err) return res.status(500).json({ error: 'Deletion error in PersonalData' });
                res.json({ success: true, message: 'Member fully deleted' });
            });
        });
    });
});

// Pobieranie wszystkich zastępów z przypisanymi uczestnikami
app.get('/troops', authenticateToken, (req, res) => {
    troopDb.find({}, (err, troops) => {
        if (err) return res.status(500).json({ error: 'Database fetch error' });
        res.json({ troops });
    });
});

// Uruchomienie serwera
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
