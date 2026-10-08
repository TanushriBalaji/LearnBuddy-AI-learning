const express = require('express');
const router = express.Router();
const { getTopics, getTopicLessons, getTopicQuiz } = require('../controllers/learningController');
const { protect } = require('../middleware/authMiddleware');

router.get('/topics', protect, getTopics);
router.get('/topics/:topicId/lessons', protect, getTopicLessons);
router.get('/topics/:topicId/quiz', protect, getTopicQuiz);

module.exports = router;
