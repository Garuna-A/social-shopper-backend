const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const {
  createRoom,
  getUserRooms,
  joinRoom,
  getRoomById
} = require('../controllers/roomController');

router.post('/', authenticate, createRoom);
router.get('/', authenticate, getUserRooms);
router.post('/join', authenticate, joinRoom);
router.get('/:id', authenticate, getRoomById);

module.exports = router;
