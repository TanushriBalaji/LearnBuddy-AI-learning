const Topic = require('../models/Topic');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');

exports.getTopics = async (req, res) => {
  try {
    const topics = await Topic.find({});
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getTopicLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find({ topicId: req.params.topicId }).sort('order');
    if (lessons) {
      res.json(lessons);
    } else {
      res.status(404).json({ message: 'Lessons not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getTopicQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ topicId: req.params.topicId });
    if (quiz) {
      res.json(quiz);
    } else {
      res.status(404).json({ message: 'Quiz not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
