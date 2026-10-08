const express = require('express');
const router = express.Router();
const { askAI } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, askAI);

module.exports = router;
