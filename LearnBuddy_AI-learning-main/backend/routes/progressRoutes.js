const express = require('express');
const router = express.Router();
const { getDetailedProgress, markLessonComplete, saveQuizScore } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getDetailedProgress);
router.post('/lesson', protect, markLessonComplete);
router.post('/quiz', protect, saveQuizScore);

module.exports = router;
