const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const { addItem , getItemsForRoom, updateItemStatus, deleteItem} = require('../controllers/itemController');

router.post('/', authenticate, addItem);
router.get('/:roomId', authenticate, getItemsForRoom);
router.patch('/:itemId',authenticate,updateItemStatus);
router.delete('/:itemId',authenticate,deleteItem)

module.exports = router;
