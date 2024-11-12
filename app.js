// app.js
const express = require('express');
const Datastore = require('nedb');
const app = express();
app.use(express.json());

// Enum dla funkcji harcerskich
const ScoutFunctions = {
    ZASTĘPOWY: 'Zastępowy',
    PODZASTĘPOWY: 'Podzastępowy',
    DRUŻYNOWY: 'Drużynowy',
    PRZYBOCZNY: 'Przyboczny'
};

// Inicjalizacja baz danych
const troopDb = new Datastore({ filename: 'troop.db', autoload: true });
const personalDataDb = new Datastore({ filename: 'personalData.db', autoload: true });
const scoutInfoDb = new Datastore({ filename: 'scoutInfo.db', autoload: true });

// Dodawanie zastępu (troop)
app.post('/troop', (req, res) => {
    const troop = {
        name: req.body.name,
        description: req.body.description,
        color: req.body.color,
        song: req.body.song,
        members: [] // Lista ID uczestników, pusta na początku
    };
    troopDb.insert(troop, (err, newTroop) => {
        if (err) return res.status(500).json({ error: 'Database insertion error' });
        res.status(201).json({ success: true, troop: newTroop });
    });
});

// Dodawanie danych osobowych uczestnika (PersonalData)
app.post('/personalData', (req, res) => {
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
app.post('/scoutInfo', (req, res) => {
    const scoutFunction = req.body.function;
    if (!Object.values(ScoutFunctions).includes(scoutFunction)) {
        return res.status(400).json({ error: 'Invalid function value' });
    }

    const scoutInfo = {
        function: scoutFunction || null,
        troopId: req.body.troopId || null, // ID zastępu, jeśli przypisano
        rankOpen: req.body.rankOpen,
        rankAchieved: req.body.rankAchieved,
        personalDataId: req.body.personalDataId // ID obiektu PersonalData
    };
    scoutInfoDb.insert(scoutInfo, (err, newScoutInfo) => {
        if (err) return res.status(500).json({ error: 'Database insertion error' });
        res.status(201).json({ success: true, scoutInfo: newScoutInfo });
    });
});

// Endpoint do edycji danych osobowych uczestnika
app.put('/personalData/:id', (req, res) => {
    const updateData = req.body;
    personalDataDb.update({ _id: req.params.id }, { $set: updateData }, {}, (err, numUpdated) => {
        if (err) return res.status(500).json({ error: 'Database update error' });
        if (numUpdated === 0) return res.status(404).json({ error: 'PersonalData not found' });
        res.json({ success: true, message: 'PersonalData updated' });
    });
});

// Endpoint do edycji informacji harcerskich uczestnika
app.put('/scoutInfo/:id', (req, res) => {
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

// Endpoint do edycji informacji o zastępie (description, color, song)
app.put('/troop/:id', (req, res) => {
    const updateData = {};
    if (req.body.description) updateData.description = req.body.description;
    if (req.body.color) updateData.color = req.body.color;
    if (req.body.song) updateData.song = req.body.song;

    troopDb.update({ _id: req.params.id }, { $set: updateData }, {}, (err, numUpdated) => {
        if (err) return res.status(500).json({ error: 'Database update error' });
        if (numUpdated === 0) return res.status(404).json({ error: 'Troop not found' });
        res.json({ success: true, message: 'Troop updated' });
    });
});

// Usuwanie uczestnika z zastępu
app.post('/troop/:troopId/removeMember/:scoutInfoId', (req, res) => {
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
app.delete('/deleteMember/:id', (req, res) => {
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
app.get('/troops', (req, res) => {
    troopDb.find({}, (err, troops) => {
        if (err) return res.status(500).json({ error: 'Database fetch error' });
        res.json({ troops });
    });
});

// Pobieranie wszystkich danych osobowych
app.get('/personalData', (req, res) => {
    personalDataDb.find({}, (err, personalData) => {
        if (err) return res.status(500).json({ error: 'Database fetch error' });
        res.json({ personalData });
    });
});

// Pobieranie wszystkich informacji harcerskich
app.get('/scoutInfo', (req, res) => {
    scoutInfoDb.find({}, (err, scoutInfo) => {
        if (err) return res.status(500).json({ error: 'Database fetch error' });
        res.json({ scoutInfo });
    });
});

// Przypisywanie uczestnika do zastępu
app.post('/assignMember', (req, res) => {
    const { troopId, scoutInfoId } = req.body;

    // Aktualizacja obiektu ScoutInfo (przypisanie troopId)
    scoutInfoDb.update({ _id: scoutInfoId }, { $set: { troopId: troopId } }, {}, (err, numUpdated) => {
        if (err) return res.status(500).json({ error: 'Assignment error in ScoutInfo' });

        // Aktualizacja obiektu Troop (dodanie scoutInfoId do listy members)
        troopDb.update({ _id: troopId }, { $push: { members: scoutInfoId } }, {}, (err, numUpdated) => {
            if (err) return res.status(500).json({ error: 'Assignment error in Troop' });
            res.json({ success: true, message: 'Member assigned to troop' });
        });
    });
});

// Uruchomienie serwera
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
