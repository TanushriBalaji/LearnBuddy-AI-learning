import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TopicView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(`http://localhost:5000/api/learning/topics/${id}/lessons`, config);
        setLessons(data);
        
        // Mark first lesson as complete immediately if available
        if (data.length > 0) {
          await axios.post('http://localhost:5000/api/progress/lesson', {
            topicId: id,
            lessonId: data[0]._id
          }, config);
        }
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    };
    fetchLessons();
  }, [id]);

  const handleNext = async () => {
    const nextIndex = currentLessonIndex + 1;
    setCurrentLessonIndex(nextIndex);
    
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post('http://localhost:5000/api/progress/lesson', {
        topicId: id,
        lessonId: lessons[nextIndex]._id
      }, config);
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  if (lessons.length === 0) {
    return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading lessons...</div>;
  }

  const currentLesson = lessons[currentLessonIndex];

  return (
    <div className="animate-fade-in card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <h2>{currentLesson.title}</h2>
        <span style={{ color: 'var(--text-secondary)' }}>Lesson {currentLessonIndex + 1} of {lessons.length}</span>
      </div>
      
      <div style={{ fontSize: '1.125rem', lineHeight: '1.8', marginBottom: '2rem', whiteSpace: 'pre-wrap' }}>
        {currentLesson.content}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button 
          className="btn btn-outline" 
          disabled={currentLessonIndex === 0}
          onClick={() => setCurrentLessonIndex(prev => prev - 1)}
        >
          Previous
        </button>
        
        {currentLessonIndex < lessons.length - 1 ? (
          <button 
            className="btn btn-primary"
            onClick={handleNext}
          >
            Next Lesson
          </button>
        ) : (
          <button 
            className="btn btn-primary"
            onClick={() => navigate(`/quiz/${id}`)}
          >
            Take Quiz
          </button>
        )}
      </div>
    </div>
  );
};

export default TopicView;
