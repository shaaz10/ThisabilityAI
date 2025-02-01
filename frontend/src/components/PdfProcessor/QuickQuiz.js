import React, { useState, useEffect } from 'react';
import axios from 'axios';

function QuickQuiz() {
  const [quiz, setQuiz] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10); // 10 seconds timer per question

  // Fetch quiz data from backend
  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/quiz')
      .then(response => {
        setQuiz(response.data);
      })
      .catch(error => {
        console.error('Error fetching quiz data:', error);
      });
  }, []);

  // Timer countdown logic
  useEffect(() => {
    if (quizStarted && !quizCompleted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000); // Decrease every second

      return () => clearInterval(timer); // Clean up the timer when component unmounts or when quiz ends
    } else if (timeLeft === 0) {
      // If time is up, move to next question
      handleNextQuestion();
    }
  }, [quizStarted, quizCompleted, timeLeft]);

  const handleAnswerChange = (selectedOption) => {
    const isCorrect = selectedOption === quiz[currentQuestionIndex]?.answer;
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }

    setUserAnswers({
      ...userAnswers,
      [currentQuestionIndex]: selectedOption
    });

    if (currentQuestionIndex === quiz.length - 1) {
      setQuizCompleted(true);
    } else {
      handleNextQuestion();
    }
  };

  // Move to next question and reset timer
  const handleNextQuestion = () => {
    setTimeLeft(10); // Reset timer to 10 seconds for the next question
    setCurrentQuestionIndex(prevIndex => prevIndex + 1); // Move to the next question
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(10); // Reset timer
  };

  return (
    <div className="App" style={styles.container}>
      <h1 style={styles.heading}>Quiz: Machine Learning Basics</h1>

      {/* Start Quiz Button */}
      {!quizStarted ? (
        <button style={styles.startButton} onClick={startQuiz}>Start Quiz</button>
      ) : quiz.length > 0 && !quizCompleted ? (
        <div style={{ ...styles.questionContainer, backgroundColor: getRandomColor() }}>
          <div style={styles.timerContainer}>
            <p style={styles.timerText}>Time Left: {timeLeft}s</p>
            <div style={styles.progressBarContainer}>
              <div
                style={{
                  ...styles.progressBar,
                  width: `${(timeLeft / 10) * 100}%`, // Adjust the width based on the remaining time
                }}
              />
            </div>
          </div>

          <div style={styles.questionBox}>
            <h3 style={styles.questionText}>{quiz[currentQuestionIndex]?.question || "Loading question..."}</h3>
            <div style={styles.optionsContainer}>
              {quiz[currentQuestionIndex]?.options ? (
                quiz[currentQuestionIndex].options.map((option, optionIndex) => (
                  <button
                    key={optionIndex}
                    style={styles.optionButton}
                    onClick={() => handleAnswerChange(option)}
                  >
                    {option}
                  </button>
                ))
              ) : (
                <p>Loading options...</p>
              )}
            </div>
          </div>

          {/* Show if the answer is correct or incorrect */}
          {userAnswers[currentQuestionIndex] !== undefined && (
            <div>
              <h4
                style={userAnswers[currentQuestionIndex] === quiz[currentQuestionIndex]?.answer ? styles.correctAnswer : styles.incorrectAnswer}
              >
                {userAnswers[currentQuestionIndex] === quiz[currentQuestionIndex]?.answer ? '+1' : '0'}
              </h4>
            </div>
          )}
        </div>
      ) : (
        <p>Loading quiz...</p>
      )}

      {/* Display the final score */}
      {quizCompleted && (
        <div style={styles.resultContainer}>
          <h2>Your Total Score: {score} out of {quiz.length}</h2>
        </div>
      )}
    </div>
  );
}

// Function to generate random colors for the question background
const getRandomColor = () => {
  const colors = ['#FFB6C1', '#B0E0E6', '#98FB98', '#FFE4B5', '#DDA0DD', '#F0E68C'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f5f5f5',
  },
  heading: {
    textAlign: 'center',
    fontSize: '2.5rem',
    marginBottom: '20px',
    color: '#333',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    margin: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    borderRadius: '5px',
    width: '200px',
    transition: 'background-color 0.3s',
  },
  questionContainer: {
    textAlign: 'center',
    marginBottom: '20px',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  timerContainer: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  timerText: {
    fontSize: '1.2rem',
    color: '#333',
  },
  progressBarContainer: {
    width: '100%',
    height: '10px',
    backgroundColor: '#ddd',
    borderRadius: '5px',
    margin: '10px 0',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: '5px',
    transition: 'width 1s ease-in-out',
  },
  questionBox: {
    backgroundColor: '#f8f8f8',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  questionText: {
    fontSize: '1.5rem',
    color: '#333',
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  optionButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    margin: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    borderRadius: '5px',
    width: '200px',
    transition: 'transform 0.2s ease, background-color 0.3s ease',
  },
  correctAnswer: {
    color: 'green',
  },
  incorrectAnswer: {
    color: 'red',
  },
  resultContainer: {
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#333',
  },
};

export default QuickQuiz;
