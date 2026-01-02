const express = require('express');
const router = express.Router();

const habitController = require('../Controller/habitController');
const authMiddleware = require('../middlewere/auth');

// all routes protected
router.post('/createHabit', authMiddleware.authUser, habitController.createHabit);
router.get('/', authMiddleware.authUser, habitController.getHabits);
router.put('/:id', authMiddleware.authUser, habitController.updateHabit);
router.delete('/:id', authMiddleware.authUser, habitController.deleteHabit);
router.post('/:id/toggle', authMiddleware.authUser, habitController.toggleHabit);

module.exports = router;
