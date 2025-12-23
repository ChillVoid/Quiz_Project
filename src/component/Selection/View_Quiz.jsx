import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const View_Quiz = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'preview';
  const encodedData = searchParams.get('data');

  const [quiz, setQuiz] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [isTerminated, setIsTerminated] = useState(false);
  const [message, setMessage] = useState("");

  const timerRef = useRef(null);

  // --- 1. THE SUBMIT LOGIC (Locks the quiz) ---
  const handleSubmit = useCallback((isViolation = false, reason = "") => {
    if (mode === 'preview') {
      alert("Preview complete.");
      navigate("/dashboard");
      return;
    }

    clearInterval(timerRef.current);
    setIsTerminated(true);

    const submission = {
      quizId: quiz?.id,
      quizTitle: quiz?.title,
      studentName: JSON.parse(localStorage.getItem("currentUser") || "{}").username || "Guest",
      answers,
      tabSwitches: isViolation ? 3 : tabSwitches,
      status: isViolation ? `TERMINATED: ${reason}` : "COMPLETED",
      submittedAt: new Date().toLocaleString()
    };

    const results = JSON.parse(localStorage.getItem("quiz_results") || "[]");
    localStorage.setItem("quiz_results", JSON.stringify([...results, submission]));

    setMessage(isViolation ? `VIOLATION: ${reason}` : "Quiz Submitted!");
    setTimeout(() => navigate("/dashboard"), 3000);
  }, [quiz, answers, tabSwitches, mode, navigate]);

  // --- 2. LOAD DATA & CHECK DUE DATE ---
  useEffect(() => {
    let loadedQuiz = null;
    try {
      if (encodedData) {
        loadedQuiz = JSON.parse(atob(decodeURIComponent(encodedData)));
      } else {
        const saved = sessionStorage.getItem("active_quiz");
        if (saved) loadedQuiz = JSON.parse(saved);
      }
    } catch (e) { console.error(e); }

    if (loadedQuiz) {
      // DUE DATE ENFORCEMENT
      if (loadedQuiz.settings?.dueDate && mode === 'take') {
        if (new Date() > new Date(loadedQuiz.settings.dueDate)) {
          setIsTerminated(true);
          setMessage("ERROR: The deadline for this quiz has passed.");
          setQuiz(loadedQuiz);
          return;
        }
      }
      setQuiz(loadedQuiz);
      setTimeRemaining((loadedQuiz.settings?.timeLimit || 0) * 60);
    } else {
      // Fallback if nothing loads
      setTimeout(() => navigate("/dashboard"), 2000);
    }
  }, [encodedData, mode, navigate]);

  // --- 3. TAB SWITCHING (3 STRIKES) ---
  useEffect(() => {
    if (mode !== 'take' || !quiz || quiz.settings?.allowAltTab || isTerminated) return;

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        setTabSwitches(prev => {
          const nextVal = prev + 1;
          if (nextVal >= 3) {
            handleSubmit(true, "Exceeded 3 tab switches");
            return 3;
          }
          setMessage(`WARNING: Tab switch detected! (${nextVal}/3)`);
          return nextVal;
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [quiz, mode, isTerminated, handleSubmit]);

  // --- 4. TIMER ---
  useEffect(() => {
    if (mode !== 'take' || !quiz || timeRemaining <= 0 || isTerminated) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmit(true, "Time Expired");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [quiz, mode, isTerminated, handleSubmit]);

  if (!quiz) return <div className="p-20 text-center font-bold">Loading Restriction Protocols...</div>;

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-10 flex flex-col items-center text-slate-100">
      
      {/* RESTRICTION HUD */}
      <div className="w-full max-w-4xl bg-slate-800 p-4 rounded-t-xl border-b border-slate-700 flex justify-between items-center shadow-2xl">
        <div className="flex gap-4">
          <div className="bg-slate-700 px-3 py-1 rounded text-xs">
            <span className="text-slate-400">STATUS:</span> {isTerminated ? "🔴 LOCKED" : "🟢 ACTIVE"}
          </div>
          {mode === 'take' && (
            <div className={`px-3 py-1 rounded text-xs ${tabSwitches > 1 ? 'bg-red-900 text-red-200' : 'bg-slate-700'}`}>
              <span className="text-slate-400">SWTICHES:</span> {tabSwitches}/3
            </div>
          )}
        </div>
        
        {mode === 'take' && (
          <div className={`text-xl font-mono font-bold ${timeRemaining < 60 ? 'text-red-500 animate-pulse' : 'text-indigo-400'}`}>
            {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
          </div>
        )}
      </div>

      {/* QUIZ CONTENT */}
      <div className={`bg-white text-slate-900 p-8 rounded-b-xl shadow-2xl w-full max-w-4xl transition-all ${isTerminated ? "opacity-40 grayscale pointer-events-none" : ""}`}>
        {message && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-600 text-red-800 font-bold flex justify-between items-center">
            <span>{message}</span>
            {isTerminated && <button onClick={() => navigate("/dashboard")} className="text-xs underline">Return to Dashboard</button>}
          </div>
        )}

        <header className="mb-8">
          <h1 className="text-3xl font-black">{quiz.title}</h1>
          <p className="text-slate-500">{quiz.pages[currentPage].title}</p>
        </header>

        <div className="space-y-8">
          {quiz.pages[currentPage].questions.map((q, qi) => (
            <div key={qi} className="p-4 border border-slate-100 rounded-lg">
              <p className="font-bold mb-4">{qi + 1}. {q.question}</p>
              {/* Question rendering logic... (same as your previous code) */}
              {q.type === 'field_text' ? (
                <input 
                  type="text" 
                  className="w-full border-b-2 p-2 outline-none focus:border-indigo-500" 
                  onChange={(e) => setAnswers({...answers, [`${currentPage}-${qi}`]: e.target.value})}
                />
              ) : (
                <div className="grid gap-2">
                  {q.options.map((opt, oi) => (
                    <label key={oi} className="flex gap-3 p-3 border rounded-md hover:bg-slate-50 cursor-pointer">
                      <input type={q.type} name={`q-${qi}`} onChange={() => setAnswers({...answers, [`${currentPage}-${qi}`]: oi})} />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-10">
          <button disabled={currentPage === 0} onClick={() => setCurrentPage(c => c - 1)} className="text-slate-400">Back</button>
          <button 
            onClick={() => {
              if (currentPage < quiz.pages.length - 1) setCurrentPage(c => c + 1);
              else handleSubmit();
            }}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold"
          >
            {currentPage === quiz.pages.length - 1 ? "FINISH" : "NEXT"}
          </button>
        </div>
      </div>
    </div>
  );
};