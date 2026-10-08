const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Topic = require('./models/Topic');
const Lesson = require('./models/Lesson');
const Quiz = require('./models/Quiz');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/learnbuddy';

const topics = [
  {
    title: 'Data Structures Mastery',
    description: 'An exhaustive deep dive into Arrays, Linked Lists, Stacks, Queues, Trees, and Graphs.',
    difficulty: 'Advanced'
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

    const lessons = [
      {
        topicId: dsTopic._id,
        title: 'Module 1: Deep Dive into Arrays',
        content: `Arrays are one of the most fundamental data structures in computer science. They store elements of the same type in contiguous memory locations. This contiguous allocation allows for extremely fast, O(1) random access time because the memory address of any element can be mathematically calculated using the base address and the index.

However, arrays have significant limitations:
1. Fixed Size: In many languages (like C and Java), arrays have a fixed size upon creation. If you run out of space, you must allocate a new, larger array and copy all elements over, which is an O(n) operation. Dynamic arrays (like ArrayList in Java or Python lists) handle this under the hood, usually doubling in size when full.
2. Costly Insertions/Deletions: Inserting or deleting an element in the middle of an array requires shifting all subsequent elements to maintain contiguous memory. This makes insertions and deletions O(n) in the worst case.

Multi-dimensional arrays exist to represent matrices or grids, laid out in memory in either row-major or column-major order. Understanding memory layout is critical for cache performance in high-performance computing.`,
        order: 1
      },
      {
        topicId: dsTopic._id,
        title: 'Module 2: The Intricacies of Linked Lists',
        content: `A Linked List is a linear data structure, but unlike arrays, elements (nodes) are not stored in contiguous memory. Instead, each node contains the data and a reference (or pointer) to the next node in the sequence.

Types of Linked Lists:
1. Singly Linked List: Each node points only to the next node.
2. Doubly Linked List: Each node points to both the next and the previous node, allowing bidirectional traversal at the cost of extra memory for the previous pointer.
3. Circular Linked List: The last node points back to the first node, creating a circle.

Advantages:
- Dynamic Size: They can easily grow and shrink without reallocating or copying data.
- Fast Insertions/Deletions: If you already have a reference to the node, inserting or deleting is an O(1) operation because it merely involves changing a couple of pointers.

Disadvantages:
- No Random Access: To access the nth element, you must traverse the list from the head, making access O(n).
- Extra Memory: The pointers require additional memory overhead.
- Poor Cache Locality: Because nodes are scattered in memory, they do not benefit from CPU caching as much as arrays do.`,
        order: 2
      },
      {
        topicId: dsTopic._id,
        title: 'Module 3: Stacks and Queues',
        content: `Stacks and Queues are abstract data types that restrict how elements can be added or removed. They can be implemented using either arrays or linked lists under the hood.

Stacks (LIFO - Last In, First Out):
Imagine a stack of plates. You can only add a plate to the top, and you can only remove a plate from the top. The last plate you added is the first one you take off.
- Push: Add an element to the top (O(1)).
- Pop: Remove the top element (O(1)).
- Peek/Top: View the top element without removing it.
Stacks are heavily used in computer science for function call stacks, undo mechanisms in text editors, and parsing expressions.

Queues (FIFO - First In, First Out):
Imagine a line of people waiting at a checkout. The first person to join the line is the first person to be served.
- Enqueue: Add an element to the back of the queue (O(1)).
- Dequeue: Remove an element from the front of the queue (O(1)).
Queues are used in scenarios like printer job scheduling, breadth-first search in graphs, and handling requests in web servers.
Variations include Circular Queues (to efficiently reuse array space) and Priority Queues (where elements are served based on priority, often implemented using Heaps).`,
        order: 3
      }
    ];

    await Lesson.insertMany(lessons);

    const quizzes = [
      {
        topicId: dsTopic._id,
        questions: [
          {
            questionText: 'Which data structure allocates memory in contiguous blocks?',
            options: ['Linked List', 'Array', 'Graph', 'Tree'],
            correctAnswerIndex: 1,
            explanation: 'Arrays allocate memory in contiguous blocks, allowing for O(1) random access.'
          },
          {
            questionText: 'What is the time complexity of accessing an element in an array by its index?',
            options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
            correctAnswerIndex: 0,
            explanation: 'Because memory is contiguous, the address can be calculated instantly using the base address and index.'
          },
          {
            questionText: 'Which of the following is a disadvantage of a standard array?',
            options: ['Fast access time', 'Fixed size', 'Easy to implement', 'Cache friendly'],
            correctAnswerIndex: 1,
            explanation: 'Standard arrays have a fixed size allocated at creation time.'
          },
          {
            questionText: 'In a singly linked list, each node contains data and...',
            options: ['A pointer to the previous node', 'Two pointers', 'A pointer to the next node', 'No pointers'],
            correctAnswerIndex: 2,
            explanation: 'A singly linked list node has a data field and exactly one pointer to the next node.'
          },
          {
            questionText: 'What is the time complexity of searching for an element in an unsorted linked list?',
            options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
            correctAnswerIndex: 1,
            explanation: 'You must traverse the list node by node from the beginning until you find the element.'
          },
          {
            questionText: 'Which data structure operates on a Last In, First Out (LIFO) principle?',
            options: ['Queue', 'Stack', 'Array', 'Linked List'],
            correctAnswerIndex: 1,
            explanation: 'A Stack is LIFO. Think of a stack of plates.'
          },
          {
            questionText: 'Which data structure operates on a First In, First Out (FIFO) principle?',
            options: ['Queue', 'Stack', 'Tree', 'Graph'],
            correctAnswerIndex: 0,
            explanation: 'A Queue is FIFO. Think of a line of people waiting.'
          },
          {
            questionText: 'What is the operation to add an element to a stack called?',
            options: ['Push', 'Pop', 'Enqueue', 'Dequeue'],
            correctAnswerIndex: 0,
            explanation: 'Push adds an element to the top of a stack.'
          },
          {
            questionText: 'What is the operation to remove an element from a queue called?',
            options: ['Push', 'Pop', 'Enqueue', 'Dequeue'],
            correctAnswerIndex: 3,
            explanation: 'Dequeue removes an element from the front of the queue.'
          },
          {
            questionText: 'Which data structure is best suited for implementing an undo feature in an application?',
            options: ['Queue', 'Linked List', 'Stack', 'Array'],
            correctAnswerIndex: 2,
            explanation: 'A stack is perfect for undo mechanisms because the most recent action (last in) is the first to be undone (first out).'
          },
          {
            questionText: 'If you need to insert an element at the very beginning of a data structure frequently, which is more efficient?',
            options: ['Array', 'Linked List', 'They are equal', 'Neither'],
            correctAnswerIndex: 1,
            explanation: 'Inserting at the head of a linked list is O(1). Inserting at the beginning of an array is O(n) because all other elements must be shifted.'
          },
          {
            questionText: 'Which data structure generally has better CPU cache locality?',
            options: ['Linked List', 'Graph', 'Array', 'Tree'],
            correctAnswerIndex: 2,
            explanation: 'Arrays have excellent cache locality because elements are stored consecutively in memory, so loading one element often loads neighboring elements into the cache.'
          },
          {
            questionText: 'What does a doubly linked list have that a singly linked list does not?',
            options: ['Data', 'A pointer to the next node', 'A pointer to the previous node', 'A head pointer'],
            correctAnswerIndex: 2,
            explanation: 'Doubly linked lists have pointers to both the next and previous nodes.'
          },
          {
            questionText: 'What happens if you try to pop from an empty stack?',
            options: ['Stack Overflow', 'Stack Underflow', 'Nothing', 'It returns 0'],
            correctAnswerIndex: 1,
            explanation: 'Attempting to remove an element from an empty stack causes a Stack Underflow error.'
          },
          {
            questionText: 'In a circular linked list...',
            options: ['The first node points to null', 'The last node points to the first node', 'There is no head pointer', 'Nodes can only contain integers'],
            correctAnswerIndex: 1,
            explanation: 'The defining characteristic of a circular linked list is that the tail node points back to the head node instead of null.'
          }
        ]
      }
    ];

    await Quiz.insertMany(quizzes);

    console.log('Massive Dataset Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
