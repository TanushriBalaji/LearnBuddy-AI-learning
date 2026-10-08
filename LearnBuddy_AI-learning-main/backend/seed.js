const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Topic = require('./models/Topic');
const Lesson = require('./models/Lesson');
const Quiz = require('./models/Quiz');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/learnbuddy';

const topics = [
  {
    title: 'Introduction to Data Structures',
    description: 'Learn the basics of arrays, linked lists, and trees.',
    difficulty: 'Beginner'
  },
  {
    title: 'Database Management Systems',
    description: 'Understand relational databases, SQL, and normalization.',
    difficulty: 'Intermediate'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');

    await Topic.deleteMany({});
    await Lesson.deleteMany({});
    await Quiz.deleteMany({});

    const createdTopics = await Topic.insertMany(topics);

    const dsTopic = createdTopics[0];
    const dbmsTopic = createdTopics[1];

    const lessons = [
      {
        topicId: dsTopic._id,
        title: 'What are Data Structures?',
        content: 'Data structures are specialized formats for organizing, processing, retrieving and storing data.',
        order: 1
      },
      {
        topicId: dsTopic._id,
        title: 'Arrays vs Linked Lists',
        content: 'Arrays store data in contiguous memory, linked lists use nodes with pointers.',
        order: 2
      },
      {
        topicId: dbmsTopic._id,
        title: 'Introduction to SQL',
        content: 'SQL stands for Structured Query Language. It is used to communicate with a database.',
        order: 1
      }
    ];

    await Lesson.insertMany(lessons);

    const quizzes = [
      {
        topicId: dsTopic._id,
        questions: [
          {
            questionText: 'Which data structure uses contiguous memory?',
            options: ['Linked List', 'Array', 'Tree', 'Graph'],
            correctAnswerIndex: 1,
            explanation: 'Arrays allocate memory in contiguous blocks.'
          }
        ]
      }
    ];

    await Quiz.insertMany(quizzes);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
