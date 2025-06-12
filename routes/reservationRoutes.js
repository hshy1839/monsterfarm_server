const express = require('express');
const router = express.Router();
const { 
    createReservation, 
    getAllReservations,
    getReservationById,
    updateReservation,

} = require('../controllers/reservationController');

router.post('/reservation', createReservation);
router.get('/reservation', getAllReservations);
router.get('/reservation/:id', getReservationById);
router.put('/reservation/:id', updateReservation);

module.exports = router;
