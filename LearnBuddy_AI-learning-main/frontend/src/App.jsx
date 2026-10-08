import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TopicView from './pages/TopicView';
import QuizView from './pages/QuizView';
import TopicsList from './pages/TopicsList';
import ChatView from './pages/ChatView';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="container animate-fade-in" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/topics" element={<TopicsList />} />
            <Route path="/chat" element={<ChatView />} />
            <Route path="/topic/:id" element={<TopicView />} />
            <Route path="/quiz/:id" element={<QuizView />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
