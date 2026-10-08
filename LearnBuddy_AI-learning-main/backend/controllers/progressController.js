const Progress = require('../models/Progress');
const Topic = require('../models/Topic');

exports.getDetailedProgress = async (req, res) => {
  try {
    const progressDocs = await Progress.find({ userId: req.user._id })
      .populate('topicId', 'title difficulty')
      .populate('completedLessons', 'title')
      .populate({
        path: 'quizScores.quizId',
        select: 'questions'
      });

    const formattedProgress = progressDocs.map(doc => {
      let maxScoreForTopic = 0;
      doc.quizScores.forEach(scoreObj => {
        if (scoreObj.maxScore > maxScoreForTopic) {
          maxScoreForTopic = scoreObj.maxScore;
        }
      });
      
      const highestScoreObj = doc.quizScores.reduce((prev, current) => (prev.score > current.score) ? prev : current, { score: 0, maxScore: 0 });

      return {
        topic: doc.topicId.title,
        difficulty: doc.topicId.difficulty,
        completedLessonsCount: doc.completedLessons.length,
        highestQuizScore: highestScoreObj.score,
        totalQuizQuestions: highestScoreObj.maxScore || 0,
        lastActive: doc.updatedAt
      };
    });

    res.json(formattedProgress);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching progress', error: error.message });
  }
};

exports.markLessonComplete = async (req, res) => {
  const { topicId, lessonId } = req.body;

  try {
    let progress = await Progress.findOne({ userId: req.user._id, topicId });

    if (!progress) {
      progress = await Progress.create({
        userId: req.user._id,
        topicId,
        completedLessons: [lessonId],
        quizScores: []
      });
    } else {
      if (!progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId);
        await progress.save();
      }
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Error saving progress', error: error.message });
  }
};

exports.saveQuizScore = async (req, res) => {
  const { topicId, quizId, score, maxScore } = req.body;

  try {
    let progress = await Progress.findOne({ userId: req.user._id, topicId });

    if (!progress) {
      progress = await Progress.create({
        userId: req.user._id,
        topicId,
        completedLessons: [],
        quizScores: [{ quizId, score, maxScore }]
      });
    } else {
      progress.quizScores.push({ quizId, score, maxScore });
      await progress.save();
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Error saving score', error: error.message });
  }
};
