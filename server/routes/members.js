const express = require('express');
const pool = require('../utils/db');
const { authenticateToken } = require('../middlewares/auth');
const { authorize } = require('../middlewares/authorize');

const router = express.Router();

router.get('/', authenticateToken, authorize([1, 2]), async (req, res) => {
    const view = req.query.view || 'personalData';
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

router.post('/', authenticateToken, authorize([1, 2]), async (req, res) => {
    const {
        firstName, lastName, birthYear, email, phoneNumber, fatherPhoneNumber, motherPhoneNumber,
        scoutFunction, rankOpen, rankAchieved, instructorRank
    } = req.body;

    try {
        if (!firstName || !lastName || !birthYear || !phoneNumber) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        const personalDataResult = await pool.query(`
            INSERT INTO personal_data (first_name, last_name, birth_year, email, phone_number, father_phone_number, mother_phone_number)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
        `, [firstName, lastName, birthYear, email || null, phoneNumber, fatherPhoneNumber || null, motherPhoneNumber || null]);

        const personalDataId = personalDataResult.rows[0].id;

        await pool.query(`
            INSERT INTO scout_info (personal_data_id, function, rank_open, rank_achieved, instructor_rank)
            VALUES ($1, $2, $3, $4, $5)
        `, [personalDataId, scoutFunction || 1, rankOpen || 0, rankAchieved || 0, instructorRank || 0]);

        res.status(201).json({ message: 'Member added successfully' });
    } catch (err) {
        console.error('Error adding member:', err);
        res.status(500).json({ error: 'Failed to add member' });
    }
});

router.put('/:id', authenticateToken, authorize([1, 2]), async (req, res) => {
    const memberId = parseInt(req.params.id, 10);
    const {
        firstName, lastName, birthYear, email, phoneNumber, fatherPhoneNumber, motherPhoneNumber,
        scoutFunction, rankOpen, rankAchieved, instructorRank
    } = req.body;

    try {
        await pool.query(`
            UPDATE personal_data
            SET first_name = $1, last_name = $2, birth_year = $3, email = $4, phone_number = $5, 
                father_phone_number = $6, mother_phone_number = $7
            WHERE id = $8
        `, [firstName, lastName, birthYear, email, phoneNumber, fatherPhoneNumber, motherPhoneNumber, memberId]);

        const scoutInfoExists = await pool.query(`SELECT id FROM scout_info WHERE personal_data_id = $1`, [memberId]);

        if (scoutInfoExists.rows.length > 0) {
            await pool.query(`
                UPDATE scout_info
                SET function = $1, rank_open = $2, rank_achieved = $3, instructor_rank = $4
                WHERE personal_data_id = $5
            `, [scoutFunction, rankOpen, rankAchieved, instructorRank, memberId]);
        } else {
            await pool.query(`
                INSERT INTO scout_info (personal_data_id, function, rank_open, rank_achieved, instructor_rank)
                VALUES ($1, $2, $3, $4, $5)
            `, [memberId, scoutFunction, rankOpen, rankAchieved, instructorRank]);
        }

        res.json({ message: 'Member updated successfully' });
    } catch (err) {
        console.error('Error updating member:', err);
        res.status(500).json({ error: 'Failed to update member' });
    }
});

router.delete('/:id', authenticateToken, authorize([1, 2]), async (req, res) => {
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

module.exports = router;
