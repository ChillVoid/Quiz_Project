import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

const VIOLATION_THRESHOLD = 3;

export const StudentQuizView = ({ quizzes, studentName, studentId }) => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [violations, setViolations] = useState(0);
  const [showViolationWarning, setShowViolationWarning] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const warningTimeoutRef = useRef(null);

  // Load quiz data
  useEffect(() => {
    const foundQuiz = quizzes.find(q => q.id === parseInt(quizId));
    if (foundQuiz) {
      setQuiz(foundQuiz);
      
      // Get all questions from all pages
      const allQuestions = [];
      foundQuiz.pages?.forEach(page => {
        if (page.questions) {
          allQuestions.push(...page.questions);
        }
      });
      
      // Set timer: use duration if available, otherwise use settings.timeLimit
      const timeInSeconds = (foundQuiz.duration || foundQuiz.settings?.timeLimit || 5) * 60;
      setTimeLeft(timeInSeconds);
      
      const savedAnswers = JSON.parse(localStorage.getItem(`quiz_answers_${studentId}_${quizId}`) || "{}");
      setAnswers(savedAnswers);
    }
  }, [quizId, quizzes, studentId]);

  // Timer effect
  useEffect(() => {
    if (!quiz || quizSubmitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz, quizSubmitted, timeLeft]);

  // Tab detection effect
  useEffect(() => {
    if (!quiz || quizSubmitted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerViolation();
      }
    };

    const handleBlur = () => {
      triggerViolation();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, [quiz, quizSubmitted]);

  // Auto-submit when violations reach threshold
  useEffect(() => {
    if (violations >= VIOLATION_THRESHOLD && !quizSubmitted && quiz) {
      handleAutoSubmit();
    }
  }, [violations, quizSubmitted, quiz]);

  const triggerViolation = useCallback(() => {
    setShowViolationWarning(true);
    setViolations(prev => prev + 1);

    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    warningTimeoutRef.current = setTimeout(() => {
      setShowViolationWarning(false);
    }, 3000);
  }, []);

  const handleAnswerChange = (questionId, optionIndex) => {
    const updatedAnswers = {
      ...answers,
      [questionId]: optionIndex
    };
    setAnswers(updatedAnswers);
    localStorage.setItem(`quiz_answers_${studentId}_${quizId}`, JSON.stringify(updatedAnswers));
  };

  // Get all questions from all pages
  const getAllQuestions = () => {
    if (!quiz) return [];
    const allQuestions = [];
    quiz.pages?.forEach(page => {
      if (page.questions) {
        allQuestions.push(...page.questions);
      }
    });
    return allQuestions;
  };

  const calculateScore = () => {
    if (!quiz) return 0;
    const allQuestions = getAllQuestions();
    let correct = 0;
    
    allQuestions.forEach(q => {
      if (answers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    
    return allQuestions.length > 0 ? Math.round((correct / allQuestions.length) * 100) : 0;
  };

  const handleAutoSubmit = useCallback(() => {
    if (!quiz) return;
    
    const score = calculateScore();
    const result = {
      quizId: quiz.id,
      quizTitle: quiz.title,
      studentId,
      studentName,
      score,
      violations,
      submittedAt: new Date().toISOString(),
      answers,
      submitted: true,
      scoreReleased: false
    };

    const attempts = JSON.parse(localStorage.getItem(`student_attempts_${studentId}`) || "{}");
    attempts[quiz.id] = { submitted: true, submittedAt: new Date().toISOString() };
    localStorage.setItem(`student_attempts_${studentId}`, JSON.stringify(attempts));

    const allResults = JSON.parse(localStorage.getItem("all_quiz_results") || "[]");
    allResults.push(result);
    localStorage.setItem("all_quiz_results", JSON.stringify(allResults));

    setQuizSubmitted(true);
  }, [quiz, answers, violations, studentId, studentName]);

  const handleSubmitClick = () => {
    setShowSubmitConfirm(true);
  };

  const confirmSubmit = () => {
    handleAutoSubmit();
    setShowSubmitConfirm(false);
  };

  if (!quiz) return <div className="p-8 text-center text-lg">Loading quiz...</div>;

  if (quizSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-md text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Submitted Successfully</h2>
          <p className="text-gray-600 mb-6">
            Your answers have been submitted. Please wait for the instructor to release your score.
          </p>
          <button
            onClick={() => navigate("/student-dashboard")}
            className="w-full bg-indigo-600 text-white font-medium py-2 rounded hover:bg-indigo-700 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const allQuestions = getAllQuestions();
  const currentQ = allQuestions[currentQuestion];
  const progress = allQuestions.length > 0 ? Math.round((currentQuestion + 1) / allQuestions.length * 100) : 0;

  if (!currentQ) {
    return <div className="p-8 text-center text-lg text-red-600">No questions found in this quiz.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showViolationWarning && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-4 flex items-center gap-3 z-50 animate-pulse">
          <span>⚠️ Warning: Tab switch detected. Violations: {violations}/{VIOLATION_THRESHOLD}</span>
        </div>
      )}

      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Submit Quiz?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to submit? You won't be able to change your answers.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 bg-gray-200 text-gray-700 font-medium py-2 rounded hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmit}
                className="flex-1 bg-indigo-600 text-white font-medium py-2 rounded hover:bg-indigo-700 transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
              <p className="text-gray-600 text-sm">Student: {studentName}</p>
            </div>
            <div className={`text-2xl font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-gray-900'}`}>
              ⏱️ {formatTime(timeLeft)}
            </div>
          </div>
          <p className="text-xs text-gray-500">Question {currentQuestion + 1} of {allQuestions.length}</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Question {currentQuestion + 1} of {allQuestions.length}</h3>
              <div className="text-sm text-gray-600">Progress: {progress}%</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <h4 className="text-xl font-semibold text-gray-900 mb-6">
            {currentQ.question}
          </h4>

          <div className="space-y-3 mb-8">
            {currentQ.options && currentQ.options.map((option, idx) => (
              <label key={idx} className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition">
                <input
                  type="radio"
                  name={`question-${currentQ.id}`}
                  checked={answers[currentQ.id] === idx}
                  onChange={() => handleAnswerChange(currentQ.id, idx)}
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="ml-3 text-gray-700">{option}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <button
              onClick={() => setCurrentQuestion(Math.min(allQuestions.length - 1, currentQuestion + 1))}
              disabled={currentQuestion === allQuestions.length - 1}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
            <button
              onClick={handleSubmitClick}
              className="ml-auto px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
            >
              Submit Quiz
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};