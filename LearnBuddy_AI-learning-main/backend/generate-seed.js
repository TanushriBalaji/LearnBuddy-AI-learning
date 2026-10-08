const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Topic = require('./models/Topic');
const Lesson = require('./models/Lesson');
const Quiz = require('./models/Quiz');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/learnbuddy';

const courseData = {
  "Data Structures": [
    { title: "Introduction to Arrays", content: "### Arrays\nAn array is a linear data structure that stores elements of the same data type in contiguous memory locations. It allows for constant time O(1) random access using indices. Arrays are fundamental for implementing lists, matrices, and other structures." },
    { title: "Linked Lists Basics", content: "### Linked Lists\nUnlike arrays, linked lists do not store elements in contiguous memory. Each element, called a node, contains data and a pointer to the next node. This allows for efficient O(1) insertions and deletions at the cost of O(n) traversal time." },
    { title: "Stacks and Queues", content: "### Stacks and Queues\nA Stack follows the Last-In-First-Out (LIFO) principle, much like a stack of plates. A Queue follows First-In-First-Out (FIFO), like a line at a store. Both can be implemented using arrays or linked lists." },
    { title: "Trees and Binary Search Trees", content: "### Trees\nA tree is a hierarchical structure consisting of nodes. A Binary Search Tree (BST) is a special type of tree where the left child is strictly smaller than the parent, and the right child is greater, enabling fast O(log n) lookups." },
    { title: "Graphs and Traversals", content: "### Graphs\nGraphs represent networks consisting of vertices (nodes) and edges (connections). Graph traversal algorithms like Breadth-First Search (BFS) and Depth-First Search (DFS) are crucial for pathfinding and network analysis." },
    { title: "Hash Tables", content: "### Hash Tables\nHash tables use a hash function to map keys to values, allowing for near O(1) average time complexity for lookups, insertions, and deletions. They are widely used for databases and caching." }
  ],
  "Database Management Systems": [
    { title: "Introduction to Databases", content: "### What is a Database?\nA DBMS provides a systematic way to create, retrieve, update, and manage data. It ensures data consistency, integrity, and security compared to flat file storage systems." },
    { title: "Relational Data Model", content: "### Relational Model\nThe relational model organizes data into tables (relations) consisting of rows (tuples) and columns (attributes). It relies heavily on primary keys and foreign keys to establish relationships between tables." },
    { title: "SQL Fundamentals", content: "### Structured Query Language\nSQL is the standard language for dealing with Relational Databases. Core commands include SELECT (retrieval), INSERT (adding data), UPDATE (modifying), and DELETE (removing data)." },
    { title: "Normalization Forms", content: "### Normalization\nNormalization is the process of organizing data to reduce redundancy and improve data integrity. It involves dividing large tables into smaller ones and linking them via relationships (1NF, 2NF, 3NF)." },
    { title: "ACID Properties", content: "### ACID Transactions\nTransactions must be Atomic (all or nothing), Consistent (valid state to valid state), Isolated (concurrent transactions don't interfere), and Durable (committed data is permanent)." },
    { title: "NoSQL Databases", content: "### NoSQL\nNoSQL databases (like MongoDB) provide a mechanism for storage and retrieval of data that is modeled in means other than tabular relations, such as documents, key-value pairs, or graphs." }
  ],
  "Operating Systems": [
    { title: "OS Overview", content: "### Operating Systems\nAn OS acts as an intermediary between the user and the computer hardware. Its primary goals are executing user programs, making the computer convenient to use, and managing hardware resources efficiently." },
    { title: "Process Management", content: "### Processes\nA process is a program in execution. The OS manages process creation, scheduling (FCFS, Round Robin), and termination. It utilizes Process Control Blocks (PCBs) to track state." },
    { title: "Threads and Concurrency", content: "### Threads\nA thread is a basic unit of CPU utilization consisting of a thread ID, program counter, register set, and stack. Multithreading allows a single process to perform multiple tasks concurrently." },
    { title: "Memory Management", content: "### Memory\nThe OS manages the primary memory (RAM), keeping track of what parts are in use and by whom. Concepts include paging, segmentation, and virtual memory (using disk space as RAM)." },
    { title: "File Systems", content: "### File Systems\nThe OS provides a logical view of information storage through files and directories. It handles file allocation, access methods, and free space management on the physical disk." },
    { title: "Deadlocks", content: "### Deadlocks\nA deadlock occurs when two or more processes are waiting indefinitely for an event that can be caused only by one of the waiting processes. Solutions include prevention, avoidance, and recovery." }
  ],
  "Computer Networks": [
    { title: "Network Basics", content: "### Networking\nA computer network is a set of computers sharing resources located on or provided by network nodes. Networks are categorized by scope (LAN, WAN) and topology (Star, Ring, Mesh)." },
    { title: "OSI Reference Model", content: "### The OSI Model\nThe Open Systems Interconnection model conceptualizes the communication functions of a computing system into 7 abstract layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application." },
    { title: "TCP/IP Protocol Suite", content: "### TCP/IP\nThe foundational protocol suite of the internet. IP (Internet Protocol) handles routing packets across networks, while TCP (Transmission Control Protocol) ensures reliable, ordered delivery." },
    { title: "Routing and Switching", content: "### Routing\nRouters operate at the Network layer (Layer 3) to forward data packets between different computer networks. Switches operate at the Data Link layer (Layer 2) to connect devices within the same network." },
    { title: "Application Layer Protocols", content: "### Application Protocols\nProtocols at the application layer provide services directly to user applications. Examples include HTTP/HTTPS (web browsing), SMTP/IMAP (email), and DNS (domain name resolution)." },
    { title: "Network Security", content: "### Security\nNetwork security involves protecting the usability and integrity of your network and data. Key concepts include firewalls, encryption (TLS/SSL), VPNs, and intrusion detection systems." }
  ],
  "Web Development Basics": [
    { title: "HTML5 Structure", content: "### HTML\nHyperText Markup Language forms the skeleton of every web page. HTML5 introduced semantic elements like `<header>`, `<footer>`, `<article>`, and `<nav>` which improve accessibility and SEO." },
    { title: "CSS3 Styling", content: "### CSS\nCascading Style Sheets dictate the visual presentation of HTML. Modern CSS includes powerful layout systems like Flexbox (for 1D layouts) and CSS Grid (for complex 2D layouts)." },
    { title: "JavaScript Fundamentals", content: "### JavaScript\nJS adds interactivity to web pages. It handles events, manipulates the DOM (Document Object Model), and communicates with servers asynchronously using Fetch or XMLHttpRequest." },
    { title: "Responsive Web Design", content: "### Responsiveness\nWebsites must look good on all devices. This is achieved using fluid grids, flexible images, and CSS media queries to adapt the layout based on the user's screen size." },
    { title: "Frontend Frameworks", content: "### Frameworks\nLibraries like React, Vue, and Angular simplify building complex user interfaces by introducing component-based architecture and efficient DOM updating mechanisms (like the Virtual DOM)." },
    { title: "REST APIs and Fetch", content: "### APIs\nRepresentational State Transfer (REST) is an architectural style for APIs. Frontend apps use HTTP methods (GET, POST, PUT, DELETE) to communicate with backend servers and exchange JSON data." }
  ]
};

const topicsData = [
  { title: 'Data Structures', description: 'Learn the basics of arrays, linked lists, trees, and graphs.', difficulty: 'Intermediate' },
  { title: 'Database Management Systems', description: 'Understand relational databases, SQL, normalization, and transactions.', difficulty: 'Intermediate' },
  { title: 'Operating Systems', description: 'Explore processes, threads, memory management, and file systems.', difficulty: 'Advanced' },
  { title: 'Computer Networks', description: 'Dive into the OSI model, TCP/IP, routing, and network security.', difficulty: 'Advanced' },
  { title: 'Web Development Basics', description: 'Master HTML, CSS, JavaScript, and building responsive frontends.', difficulty: 'Beginner' }
];

const generateLessonsForTopic = (topicId, topicTitle) => {
  const lessons = [];
  const topicLessons = courseData[topicTitle] || [];
  
  for (let i = 0; i < 6; i++) {
    const lessonData = topicLessons[i] || { title: `${topicTitle} - Module ${i+1}`, content: `Content for module ${i+1}` };
    lessons.push({
      topicId: topicId,
      title: lessonData.title,
      content: lessonData.content + `\n\n#### Summary\nThis module covers the core concepts of ${lessonData.title}. Practice these topics to prepare for the quiz.`,
      order: i + 1
    });
  }
  return lessons;
};

const quizData = {
  "Data Structures": [
    { q: "Which data structure uses LIFO?", opts: ["Queue", "Stack", "Tree", "Graph"], a: 1, exp: "Stack follows Last-In-First-Out." },
    { q: "Which data structure uses FIFO?", opts: ["Queue", "Stack", "Array", "Linked List"], a: 0, exp: "Queue follows First-In-First-Out." },
    { q: "What is the time complexity of binary search?", opts: ["O(1)", "O(n)", "O(log n)", "O(n^2)"], a: 2, exp: "Binary search halves the search space each time." },
    { q: "Which data structure is used for BFS?", opts: ["Stack", "Queue", "Priority Queue", "Array"], a: 1, exp: "BFS uses a Queue to keep track of nodes to visit." },
    { q: "Which data structure is used for DFS?", opts: ["Stack", "Queue", "Heap", "Linked List"], a: 0, exp: "DFS uses a Stack (or recursion) to explore paths deeply." },
    { q: "What is the worst-case time complexity of quicksort?", opts: ["O(n log n)", "O(n)", "O(n^2)", "O(1)"], a: 2, exp: "Worst case is O(n^2) when the pivot is poorly chosen." },
    { q: "In a BST, the left child is always:", opts: ["Greater than the parent", "Smaller than the parent", "Equal to the parent", "Null"], a: 1, exp: "Left children are always smaller in a Binary Search Tree." },
    { q: "Which data structure prevents duplicate elements?", opts: ["Array", "Linked List", "Set", "Queue"], a: 2, exp: "Sets inherently prevent duplicate values." },
    { q: "What is a complete binary tree?", opts: ["Every node has 2 children", "All levels are completely filled except possibly the last", "All leaves are at the same level", "Nodes have no children"], a: 1, exp: "This is the definition of a complete binary tree." },
    { q: "Which sorting algorithm is stable?", opts: ["Quicksort", "Heapsort", "Merge Sort", "Selection Sort"], a: 2, exp: "Merge Sort maintains the relative order of equal elements." },
    { q: "What does a Hash Table use to map keys to values?", opts: ["Binary Search", "Hash Function", "Linear Search", "Pointers"], a: 1, exp: "A hash function computes an index into an array of buckets." },
    { q: "What is the time complexity of accessing an array element?", opts: ["O(n)", "O(log n)", "O(1)", "O(n^2)"], a: 2, exp: "Array elements are accessed in constant time using an index." },
    { q: "Which graph traversal finds the shortest path in an unweighted graph?", opts: ["DFS", "BFS", "Dijkstra", "A*"], a: 1, exp: "BFS guarantees the shortest path in an unweighted graph." },
    { q: "What data structure does a Priority Queue use under the hood?", opts: ["Linked List", "Array", "Heap", "Stack"], a: 2, exp: "Priority Queues are typically implemented using Heaps." },
    { q: "What is a doubly linked list?", opts: ["Nodes have 2 data fields", "Nodes point to next and previous nodes", "Nodes point to 2 next nodes", "A list with 2 heads"], a: 1, exp: "Doubly linked lists have pointers to both previous and next nodes." }
  ],
  "Database Management Systems": [
    { q: "What does SQL stand for?", opts: ["Structured Query Language", "Strong Question Language", "Structured Query List", "Simple Query Language"], a: 0, exp: "SQL is the standard language for relational databases." },
    { q: "Which key uniquely identifies a row in a table?", opts: ["Foreign Key", "Primary Key", "Super Key", "Candidate Key"], a: 1, exp: "A Primary Key is a unique identifier for a row." },
    { q: "Which SQL command is used to add data?", opts: ["ADD", "UPDATE", "INSERT", "CREATE"], a: 2, exp: "INSERT is used to add new rows to a table." },
    { q: "What does ACID stand for?", opts: ["Atomicity, Consistency, Isolation, Durability", "Action, Control, Isolation, Data", "Array, Consistency, Integer, Double", "Atomicity, Control, Integrity, Data"], a: 0, exp: "ACID properties guarantee reliable transaction processing." },
    { q: "Which normal form removes partial dependencies?", opts: ["1NF", "2NF", "3NF", "BCNF"], a: 1, exp: "2NF ensures no non-prime attribute is dependent on a proper subset of a candidate key." },
    { q: "What is a Foreign Key?", opts: ["A key from another database", "A key that links to a Primary Key in another table", "A key used for foreign characters", "A uniquely generated key"], a: 1, exp: "Foreign keys establish relationships between tables." },
    { q: "Which command removes a table completely?", opts: ["DELETE", "TRUNCATE", "DROP", "REMOVE"], a: 2, exp: "DROP completely deletes the table schema and data." },
    { q: "What is a join?", opts: ["Combining tables based on a related column", "Adding rows together", "Merging two databases", "Concatenating strings"], a: 0, exp: "Joins combine columns from one or more tables." },
    { q: "Which type of database is MongoDB?", opts: ["Relational", "Key-Value", "Document", "Graph"], a: 2, exp: "MongoDB is a NoSQL Document-oriented database." },
    { q: "What does a VIEW do?", opts: ["Creates a virtual table based on a query", "Provides a UI for the database", "Takes a snapshot of data", "Locks a table"], a: 0, exp: "A View is a virtual table representing the result of a query." },
    { q: "What is database normalization?", opts: ["Scaling the database", "Securing the database", "Organizing data to reduce redundancy", "Backing up data"], a: 2, exp: "Normalization minimizes duplication and avoids data anomalies." },
    { q: "Which clause filters rows after grouping?", opts: ["WHERE", "ORDER BY", "HAVING", "FILTER"], a: 2, exp: "HAVING filters aggregated data after a GROUP BY." },
    { q: "What is an index used for?", opts: ["Encrypting data", "Speeding up data retrieval", "Creating foreign keys", "Preventing null values"], a: 1, exp: "Indexes improve the speed of data retrieval operations." },
    { q: "What does the SELECT statement do?", opts: ["Updates data", "Retrieves data", "Deletes data", "Inserts data"], a: 1, exp: "SELECT is used to query data from the database." },
    { q: "What is a tuple?", opts: ["A column", "A table", "A row", "A relationship"], a: 2, exp: "In relational algebra, a tuple represents a row." }
  ],
  "Operating Systems": [
    { q: "What is an Operating System?", opts: ["Hardware", "A compiler", "An intermediary between user and hardware", "A web browser"], a: 2, exp: "An OS manages computer hardware and software resources." },
    { q: "What is a process?", opts: ["A saved file", "A program in execution", "A hardware component", "A thread"], a: 1, exp: "A process is an instance of a computer program that is being executed." },
    { q: "What is a thread?", opts: ["A piece of string", "A lightweight process", "A memory block", "A CPU register"], a: 1, exp: "A thread is the smallest sequence of programmed instructions." },
    { q: "Which scheduling algorithm is non-preemptive?", opts: ["Round Robin", "Shortest Remaining Time First", "First Come First Serve", "Priority Scheduling (preemptive)"], a: 2, exp: "FCFS runs a process until it completes or blocks." },
    { q: "What is deadlock?", opts: ["OS crashes", "Two processes waiting for each other indefinitely", "Memory is full", "CPU overheats"], a: 1, exp: "Deadlock occurs when processes wait on each other in a circular chain." },
    { q: "What does virtual memory do?", opts: ["Uses disk space to simulate extra RAM", "Uses RAM to simulate disk space", "Stores data in the cloud", "Creates virtual machines"], a: 0, exp: "Virtual memory allows execution of processes larger than physical memory." },
    { q: "What is a page fault?", opts: ["A bug in a web page", "When a requested memory page is not in RAM", "When the disk crashes", "When a process terminates"], a: 1, exp: "A page fault triggers the OS to fetch the page from disk." },
    { q: "What is a kernel?", opts: ["The core component of an OS", "A type of memory", "A CPU component", "A file system type"], a: 0, exp: "The kernel has complete control over everything in the system." },
    { q: "What is the purpose of a system call?", opts: ["To call another computer", "To request a service from the OS kernel", "To terminate a program", "To reboot the system"], a: 1, exp: "System calls provide an interface to OS services." },
    { q: "What is Thrashing?", opts: ["High CPU usage", "Excessive paging leading to low CPU utilization", "A security attack", "Fast process execution"], a: 1, exp: "Thrashing occurs when the OS spends more time paging than executing." },
    { q: "What is a mutex?", opts: ["A mutual exclusion lock", "A type of process", "A memory address", "A scheduling algorithm"], a: 0, exp: "Mutexes prevent multiple threads from accessing a shared resource simultaneously." },
    { q: "What is a context switch?", opts: ["Changing user accounts", "Switching CPU from one process to another", "Changing network IPs", "Switching monitors"], a: 1, exp: "Context switching stores the state of a process so execution can resume later." },
    { q: "Which memory allocation is subject to external fragmentation?", opts: ["Paging", "Segmentation", "Contiguous Allocation", "Virtual Memory"], a: 2, exp: "Contiguous allocation leaves unusable gaps between memory blocks." },
    { q: "What is an interrupt?", opts: ["A user clicking a mouse", "A signal to the CPU indicating an event needs immediate attention", "A power failure", "A process error"], a: 1, exp: "Interrupts temporarily halt the CPU to handle critical tasks." },
    { q: "What is the bootloader?", opts: ["A program that loads the OS into memory", "A virus", "A process scheduler", "A memory manager"], a: 0, exp: "The bootloader executes right after POST to start the OS." }
  ],
  "Computer Networks": [
    { q: "What does IP stand for?", opts: ["Internal Process", "Internet Protocol", "Intranet Provider", "Internet Process"], a: 1, exp: "IP is responsible for routing packets across network boundaries." },
    { q: "How many layers are in the OSI model?", opts: ["4", "5", "7", "9"], a: 2, exp: "The OSI model consists of 7 abstract layers." },
    { q: "Which layer is responsible for routing?", opts: ["Physical", "Data Link", "Network", "Transport"], a: 2, exp: "The Network layer (Layer 3) handles routing." },
    { q: "What is a MAC address?", opts: ["A physical address assigned to a network interface", "An IP address", "A website URL", "An Apple computer address"], a: 0, exp: "Media Access Control addresses uniquely identify hardware." },
    { q: "Which protocol guarantees delivery?", opts: ["UDP", "IP", "TCP", "ICMP"], a: 2, exp: "Transmission Control Protocol ensures reliable data delivery." },
    { q: "What port does HTTP use?", opts: ["443", "80", "21", "22"], a: 1, exp: "HTTP defaults to port 80." },
    { q: "What port does HTTPS use?", opts: ["443", "80", "21", "22"], a: 0, exp: "HTTPS defaults to port 443." },
    { q: "What does DNS do?", opts: ["Encrypts data", "Translates domain names to IP addresses", "Routes packets", "Assigns IP addresses"], a: 1, exp: "The Domain Name System acts as the phonebook of the internet." },
    { q: "What does DHCP do?", opts: ["Assigns IP addresses dynamically", "Translates IPs to MACs", "Secures the network", "Sends emails"], a: 0, exp: "Dynamic Host Configuration Protocol automatically assigns IPs." },
    { q: "Which protocol is used for sending emails?", opts: ["POP3", "IMAP", "SMTP", "FTP"], a: 2, exp: "Simple Mail Transfer Protocol is used for sending emails." },
    { q: "What is a subnet mask used for?", opts: ["Hiding the IP address", "Identifying the network and host portions of an IP", "Encrypting data", "Blocking viruses"], a: 1, exp: "Subnet masks determine which part of an IP is the network." },
    { q: "What operates at Layer 2 (Data Link)?", opts: ["Router", "Hub", "Switch", "Gateway"], a: 2, exp: "Switches forward frames based on MAC addresses at Layer 2." },
    { q: "What is the loopback IP address?", opts: ["192.168.1.1", "10.0.0.1", "127.0.0.1", "0.0.0.0"], a: 2, exp: "127.0.0.1 points back to the local machine." },
    { q: "Which protocol is connectionless?", opts: ["TCP", "UDP", "FTP", "SSH"], a: 1, exp: "User Datagram Protocol sends packets without establishing a connection." },
    { q: "What is a firewall?", opts: ["A physical wall", "A device that filters network traffic based on rules", "An antivirus software", "A type of router"], a: 1, exp: "Firewalls monitor and control incoming and outgoing network traffic." }
  ],
  "Web Development Basics": [
    { q: "What does HTML stand for?", opts: ["HyperText Markup Language", "Hyperlinks Text Mark Language", "Home Tool Markup Language", "HyperText Machine Language"], a: 0, exp: "HTML is the standard markup language for documents designed to be displayed in a web browser." },
    { q: "What does CSS do?", opts: ["Structures the webpage", "Styles the webpage", "Adds interactivity", "Manages the database"], a: 1, exp: "Cascading Style Sheets describe how HTML elements are displayed." },
    { q: "Which HTML tag is used for the largest heading?", opts: ["<heading>", "<h6>", "<h1>", "<head>"], a: 2, exp: "<h1> defines the most important heading." },
    { q: "What is the correct syntax for a JavaScript variable?", opts: ["let myVar;", "variable myVar;", "v myVar;", "int myVar;"], a: 0, exp: "'let', 'const', and 'var' are used to declare variables in JS." },
    { q: "What does DOM stand for?", opts: ["Data Object Model", "Document Object Model", "Design Object Model", "Display Object Management"], a: 1, exp: "The DOM is a programming interface for web documents." },
    { q: "Which CSS property is used to change text color?", opts: ["text-color", "fgcolor", "color", "font-color"], a: 2, exp: "The 'color' property specifies the color of text." },
    { q: "What is responsive web design?", opts: ["Websites that respond quickly", "Websites that adapt to different screen sizes", "Websites that talk to users", "Websites that load instantly"], a: 1, exp: "Responsive design ensures pages look good on all devices." },
    { q: "Which HTML tag links to an external CSS file?", opts: ["<style>", "<link>", "<css>", "<script>"], a: 1, exp: "<link rel='stylesheet' href='...'> is the correct way." },
    { q: "What does an API do?", opts: ["Styles a page", "Allows software applications to communicate", "Stores data locally", "Renders HTML"], a: 1, exp: "Application Programming Interfaces allow communication between systems." },
    { q: "What is the default display value of a <div>?", opts: ["inline", "block", "inline-block", "flex"], a: 1, exp: "A <div> is a block-level element." },
    { q: "How do you select an element with id 'main' in CSS?", opts: [".main", "*main", "#main", "main"], a: 2, exp: "The '#' selector targets elements by their ID." },
    { q: "What does 'JSON' stand for?", opts: ["JavaScript Object Notation", "JavaScript Online Node", "Java Standard Object Notation", "JavaScript Original Notation"], a: 0, exp: "JSON is a lightweight format for storing and transporting data." },
    { q: "Which keyword is used to declare an asynchronous function in JS?", opts: ["async", "await", "defer", "promise"], a: 0, exp: "The 'async' keyword allows you to write promise-based code as if it were synchronous." },
    { q: "What is React?", opts: ["A CSS framework", "A JavaScript library for building user interfaces", "A database", "A backend language"], a: 1, exp: "React is a declarative, efficient, and flexible JS library for UI." },
    { q: "Which HTML attribute specifies an alternate text for an image?", opts: ["src", "title", "alt", "desc"], a: 2, exp: "The 'alt' attribute provides alternative information for an image." }
  ]
};

const generateQuizzesForTopic = (topicId, topicTitle) => {
  const questionsList = quizData[topicTitle] || [];
  const questions = questionsList.map(qData => ({
    questionText: qData.q,
    options: qData.opts,
    correctAnswerIndex: qData.a,
    explanation: qData.exp
  }));
  
  return {
    topicId: topicId,
    questions: questions
  };
};

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');

    await Topic.deleteMany({});
    await Lesson.deleteMany({});
    await Quiz.deleteMany({});
    console.log('Cleared existing data.');

    const createdTopics = await Topic.insertMany(topicsData);
    console.log(`Inserted ${createdTopics.length} topics.`);

    let allLessons = [];
    let allQuizzes = [];

    for (const topic of createdTopics) {
      const lessons = generateLessonsForTopic(topic._id, topic.title);
      allLessons = allLessons.concat(lessons);

      const quiz = generateQuizzesForTopic(topic._id, topic.title);
      allQuizzes.push(quiz);
    }

    await Lesson.insertMany(allLessons);
    console.log(`Inserted ${allLessons.length} lessons.`);

    await Quiz.insertMany(allQuizzes);
    console.log(`Inserted ${allQuizzes.length} quizzes.`);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
