import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const QuizView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(`http://localhost:5000/api/learning/topics/${id}/quiz`, config);
        setQuiz(data);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setQuiz({ notFound: true });
      }
    };
    fetchQuiz();
  }, [id]);

  if (!quiz) {
    return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading quiz...</div>;
  }

  if (quiz.notFound || !quiz.questions || quiz.questions.length === 0) {
     return <div style={{ textAlign: 'center', marginTop: '2rem' }}>No questions available for this topic yet.</div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleOptionSelect = (index) => {
    if (showExplanation) return;
    setSelectedOption(index);
    setShowExplanation(true);
    
    if (index === currentQuestion.correctAnswerIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = async () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.post('http://localhost:5000/api/progress/quiz', {
          topicId: id,
          quizId: quiz._id,
          score,
          maxScore: quiz.questions.length
        }, config);
      } catch (err) {
        console.error("Error saving score", err);
      }
    }
  };

  if (isFinished) {
    return (
      <div className="card animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h2>Quiz Completed!</h2>
        <p style={{ fontSize: '1.25rem', margin: '1rem 0' }}>Your score: {score} out of {quiz.questions.length}</p>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="card animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0 }}>Question {currentQuestionIndex + 1} of {quiz.questions.length}</h3>
        <span style={{ fontWeight: 'bold', color: 'var(--accent-primary)' }}>Score: {score}</span>
      </div>

      <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>{currentQuestion.questionText}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {currentQuestion.options.map((option, index) => {
          let bgColor = 'var(--bg-secondary)';
          let borderColor = 'var(--border-color)';
          
          if (showExplanation) {
            if (index === currentQuestion.correctAnswerIndex) {
              bgColor = 'rgba(16, 185, 129, 0.2)';
              borderColor = 'var(--accent-success)';
            } else if (index === selectedOption) {
              bgColor = 'rgba(239, 68, 68, 0.2)';
              borderColor = 'var(--accent-danger)';
            }
          } else if (index === selectedOption) {
            borderColor = 'var(--accent-primary)';
          }

          return (
            <button 
              key={index}
              onClick={() => handleOptionSelect(index)}
              style={{
                textAlign: 'left',
                padding: '1rem',
                borderRadius: '0.5rem',
                background: bgColor,
                border: `1px solid ${borderColor}`,
                color: 'var(--text-primary)',
                fontSize: '1rem',
                cursor: showExplanation ? 'default' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {option}
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className="animate-fade-in" style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}>
          <strong>Explanation:</strong> {currentQuestion.explanation}
        </div>
      )}

      {showExplanation && (
        <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleNext}>
          {currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
        </button>
      )}
    </div>
  );
};

export default QuizView;
