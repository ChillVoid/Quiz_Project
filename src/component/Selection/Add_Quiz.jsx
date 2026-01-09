import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Add_Quiz = ({ onQuizAdded }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [quizDuration, setQuizDuration] = useState(5);
  const [quizDueDate, setQuizDueDate] = useState("");
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(0);

  const [pages, setPages] = useState(() => {
    const saved = localStorage.getItem("quiz_draft");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed.pages)) return parsed.pages;
    }
    return [
      {
        title: "Page 1",
        description: "",
        questions: [
          { id: 1, question: "", type: "radio", required: true, options: [""], correctIndex: 0, correctAnswer: "", points: 1 },
        ],
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem("quiz_draft", JSON.stringify({ quizTitle, quizDescription, quizDuration, quizDueDate, pages }));
  }, [quizTitle, quizDescription, quizDuration, quizDueDate, pages]);

  const validateStep1 = () => {
    let newErrors = {};
    if (!quizTitle.trim()) newErrors.title = "Quiz title cannot be empty.";
    if (!quizDuration || quizDuration <= 0) newErrors.duration = "Duration must be at least 1 minute.";
    if (quizDuration > 300) newErrors.duration = "Duration cannot exceed 300 minutes (5 hours).";
    
    if (quizDueDate) {
      const selectedDate = new Date(quizDueDate);
      const now = new Date();
      if (selectedDate < now) {
        newErrors.dueDate = "Due date must be in the future.";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateBuilder = () => {
    let newErrors = {};
    pages.forEach((p, pi) => {
      if (!p.title.trim()) newErrors[`p-title-${pi}`] = "Page title is required";
      p.questions.forEach((q, qi) => {
        if (!q.question.trim()) newErrors[`q-${pi}-${qi}`] = "Question text is required";
        if (q.type !== "field_text") {
          if (q.options.some(opt => !opt.trim())) newErrors[`o-${pi}-${qi}`] = "All options must have text";
          else if (q.options.length < 2) newErrors[`o-${pi}-${qi}`] = "At least 2 options required";
        } else {
          if (!q.correctAnswer?.trim()) newErrors[`o-${pi}-${qi}`] = "Correct answer text is required";
        }
        if (q.points <= 0) newErrors[`p-${pi}-${qi}`] = "Points must be at least 1";
      });
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFinish = () => {
    if (!validateBuilder()) {
      alert("Please fix the errors in your quiz before publishing.");
      return;
    }

    const finalQuiz = {
      id: Date.now(),
      title: quizTitle,
      description: quizDescription,
      duration: quizDuration,
      dueDate: quizDueDate, 
      pages: pages,
      totalQuestions: pages.reduce((sum, p) => sum + (p.questions?.length || 0), 0),
      settings: { 
        timeLimit: quizDuration,
        dueDate: quizDueDate,
        allowAltTab: true,
        createdAt: new Date().toLocaleString()
      }
    };

    const existingQuizzes = JSON.parse(localStorage.getItem("global_quizzes") || "[]");
    const updatedQuizzes = [...existingQuizzes, finalQuiz];
    localStorage.setItem("global_quizzes", JSON.stringify(updatedQuizzes));
    
    localStorage.removeItem("quiz_draft");
    sessionStorage.setItem("active_quiz", JSON.stringify(finalQuiz));

    alert("✅ Quiz Published Successfully!");
    
    if (onQuizAdded) onQuizAdded();
    navigate("/dashboard"); 
  };

  /* == BUILDER HELPERS == */
  const addPage = () => {
    setPages((prev) => [
      ...prev,
      {
        title: `Page ${prev.length + 1}`,
        description: "",
        questions: [{ id: Date.now(), question: "", type: "radio", required: true, options: [""], correctIndex: 0, correctAnswer: "", points: 1 }],
      },
    ]);
    setCurrentPage(pages.length);
  };

  const removePage = (pageIndex) => {
    if (pages.length === 1) return;
    setPages((prev) => prev.filter((_, i) => i !== pageIndex));
    setCurrentPage((p) => Math.max(0, p - 1));
  };

  const updatePageTitle = (value) => {
    setPages((prev) => prev.map((p, i) => (i === currentPage ? { ...p, title: value } : p)));
  };

  const addQuestion = () => {
    setPages((prev) =>
      prev.map((p, i) =>
        i === currentPage
          ? { ...p, questions: [...p.questions, { id: Date.now(), question: "", type: "radio", required: true, options: [""], correctIndex: 0, correctAnswer: "", points: 1 }] }
          : p
      )
    );
  };

  const removeQuestion = (qIndex) => {
    setPages((prev) =>
      prev.map((p, i) => (i === currentPage ? { ...p, questions: p.questions.filter((_, qi) => qi !== qIndex) } : p))
    );
  };

  const updateQuestion = (qIndex, value) => {
    setPages((prev) =>
      prev.map((p, i) =>
        i === currentPage
          ? { ...p, questions: p.questions.map((q, qi) => (qi === qIndex ? { ...q, question: value } : q)) }
          : p
      )
    );
  };

  const updateType = (qIndex, type) => {
    setPages((prev) =>
      prev.map((p, i) =>
        i === currentPage
          ? { ...p, questions: p.questions.map((q, qi) => (qi === qIndex ? { ...q, type, correctIndex: type === "checkbox" ? [] : 0 } : q)) }
          : p
      )
    );
  };

  const updateFieldAnswer = (qIndex, value) => {
    setPages((prev) =>
        prev.map((p, i) =>
          i === currentPage
            ? { ...p, questions: p.questions.map((q, qi) => (qi === qIndex ? { ...q, correctAnswer: value } : q)) }
            : p
        )
      );
  };

  const updatePoints = (qIndex, value) => {
    setPages((prev) =>
      prev.map((p, i) =>
        i === currentPage
          ? { ...p, questions: p.questions.map((q, qi) => (qi === qIndex ? { ...q, points: parseInt(value) || 0 } : q)) }
          : p
      )
    );
  };

  const toggleRequired = (qIndex) => {
    setPages((prev) =>
      prev.map((p, i) =>
        i === currentPage
          ? { ...p, questions: p.questions.map((q, qi) => (qi === qIndex ? { ...q, required: !q.required } : q)) }
          : p
      )
    );
  };

  const addOption = (qIndex) => {
    setPages((prev) =>
      prev.map((p, i) =>
        i === currentPage ? { ...p, questions: p.questions.map((q, qi) => (qi === qIndex ? { ...q, options: [...q.options, ""] } : q)) } : p
      )
    );
  };

  const removeOption = (qIndex, oIndex) => {
    setPages((prev) =>
      prev.map((p, i) =>
        i === currentPage
          ? { ...p, questions: p.questions.map((q, qi) => (qi === qIndex ? { ...q, options: q.options.filter((_, oi) => oi !== oIndex) } : q)) }
          : p
      )
    );
  };

  const updateOption = (qIndex, oIndex, value) => {
    setPages((prev) =>
      prev.map((p, i) =>
        i === currentPage
          ? { ...p, questions: p.questions.map((q, qi) => (qi === qIndex ? { ...q, options: q.options.map((opt, oi) => (oi === oIndex ? value : opt)) } : q)) }
          : p
      )
    );
  };

  const setCorrect = (qIndex, oIndex) => {
    setPages((prev) =>
      prev.map((p, i) =>
        i === currentPage
          ? {
              ...p,
              questions: p.questions.map((q, qi) => {
                if (qi !== qIndex) return q;
                if (q.type === "checkbox") {
                  const list = Array.isArray(q.correctIndex) ? q.correctIndex : [];
                  return { ...q, correctIndex: list.includes(oIndex) ? list.filter((x) => x !== oIndex) : [...list, oIndex] };
                }
                return { ...q, correctIndex: oIndex };
              }),
            }
          : p
      )
    );
  };

  const calculateTotalScore = () => {
    return pages.reduce((total, p) => total + p.questions.reduce((pageTotal, q) => pageTotal + (q.points || 0), 0), 0);
  };

  const handleDurationChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    if (value < 1) {
      setQuizDuration(1);
    } else if (value > 300) {
      setQuizDuration(300);
    } else {
      setQuizDuration(value);
    }
  };

  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const page = pages[currentPage];

  return (
    <div className="min-h-screen bg-indigo-300 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-4xl rounded-lg p-8 shadow-lg">

        {step === 0 && (
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold">Quiz Builder</h1>
            <p className="text-gray-600">Create quizzes step-by-step for your students</p>
            <button onClick={() => setStep(1)} className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-indigo-700 transition">
              CREATE
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Quiz Title, Duration & Intro</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title *</label>
              <input
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                placeholder="Enter quiz title (Required)"
                className={`w-full px-4 py-3 border rounded-lg ${errors.title ? "border-red-500" : ""}`}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes) *</label>
              <input
                type="number"
                value={quizDuration}
                onChange={handleDurationChange}
                min="1"
                max="300"
                className={`w-full px-4 py-3 border rounded-lg ${errors.duration ? "border-red-500" : ""}`}
                placeholder="Enter quiz duration (1-300 minutes)"
              />
              {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
              <p className="text-gray-500 text-xs mt-1">Range: 1-300 minutes (5 hours max)</p>
            </div>

            {/* NEW: Due Date Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Due Date (Optional)</label>
              <input
                type="datetime-local"
                value={quizDueDate}
                onChange={(e) => setQuizDueDate(e.target.value)}
                min={getTodayString()}
                className={`w-full px-4 py-3 border rounded-lg ${errors.dueDate ? "border-red-500" : ""}`}
              />
              {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
              {quizDueDate && (
                <p className="text-gray-600 text-xs mt-1">
                  Due: {new Date(quizDueDate).toLocaleString()}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Description (Optional)</label>
              <textarea
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
                placeholder="Enter quiz introduction (Optional)..."
                className="w-full px-4 py-3 border rounded-lg h-32 resize-y"
              />
            </div>
            
            <div className="flex justify-between">
              <button onClick={() => setStep(0)} className="text-gray-500 hover:text-gray-700 transition">Back</button>
              <button onClick={() => { if(validateStep1()) setStep(2) }} className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition">Next</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-indigo-100 p-4 rounded-lg text-center font-bold text-indigo-800">
              Total Quiz Score: {calculateTotalScore()} points | Duration: {quizDuration} minutes {quizDueDate && `| Due: ${new Date(quizDueDate).toLocaleDateString()}`}
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {pages.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`px-4 py-1 rounded whitespace-nowrap ${i === currentPage ? "bg-indigo-600 text-white" : "bg-gray-200 hover:bg-gray-300"} transition`}
                  >
                    {p.title || `Page ${i + 1}`}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={addPage} className="text-indigo-600 font-bold hover:text-indigo-700">+ Page</button>
                <button onClick={() => removePage(currentPage)} className="text-red-500 hover:text-red-600" disabled={pages.length === 1}>- Page</button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">Page Title:</label>
              <input
                value={page.title}
                onChange={(e) => updatePageTitle(e.target.value)}
                placeholder="Enter page title"
                className={`w-full px-4 py-3 border rounded-lg ${errors[`p-title-${currentPage}`] ? "border-red-500" : ""}`}
              />
              {errors[`p-title-${currentPage}`] && <p className="text-red-500 text-xs mt-1">{errors[`p-title-${currentPage}`]}</p>}
            </div>

            <div className="space-y-8">
              {page.questions.map((q, qIndex) => (
                <div key={qIndex} className="border border-gray-200 rounded-lg p-6 space-y-4 shadow-sm relative">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-indigo-900">Question {qIndex + 1}</h3>
                    <button onClick={() => removeQuestion(qIndex)} className="text-red-400 hover:text-red-600">Remove</button>
                  </div>

                  <input
                    value={q.question}
                    onChange={(e) => updateQuestion(qIndex, e.target.value)}
                    className={`w-full border-b-2 outline-none py-2 text-lg ${errors[`q-${currentPage}-${qIndex}`] ? "border-red-500" : "border-gray-100 focus:border-indigo-400"}`}
                    placeholder="Enter your question here..."
                  />
                  {errors[`q-${currentPage}-${qIndex}`] && <p className="text-red-500 text-xs">{errors[`q-${currentPage}-${qIndex}`]}</p>}

                  <div className="flex gap-6 items-center bg-gray-50 p-3 rounded-md">
                    <select 
                      value={q.type} 
                      onChange={(e) => updateType(qIndex, e.target.value)}
                      className="bg-white border rounded px-2 py-1 outline-none"
                    >
                      <option value="radio">Multiple Choice</option>
                      <option value="checkbox">Checkboxes</option>
                      <option value="field_text">Short Answer</option>
                    </select>

                    <label className="flex gap-2 items-center cursor-pointer select-none">
                      <input type="checkbox" checked={q.required} onChange={() => toggleRequired(qIndex)} className="w-4 h-4" />
                      <span className="text-sm text-gray-700">Required</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">Points:</span>
                      <input
                        type="number"
                        value={q.points}
                        onChange={(e) => updatePoints(qIndex, e.target.value)}
                        min="1"
                        className="w-16 px-2 py-1 border rounded"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {q.type === "field_text" ? (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-500 mb-1">Correct Answer:</p>
                        <input 
                          value={q.correctAnswer || ""}
                          onChange={(e) => updateFieldAnswer(qIndex, e.target.value)}
                          className={`w-full border rounded px-3 py-2 ${errors[`o-${currentPage}-${qIndex}`] ? "border-red-500 bg-red-50" : "bg-indigo-50 border-indigo-100"}`}
                          placeholder="Type the expected answer..."
                        />
                      </div>
                    ) : (
                      <>
                        {q.options.map((opt, oIndex) => (
                          <div key={oIndex} className="flex gap-3 items-center group">
                            <input
                              type={q.type === "checkbox" ? "checkbox" : "radio"}
                              checked={q.type === "checkbox" ? Array.isArray(q.correctIndex) && q.correctIndex.includes(oIndex) : q.correctIndex === oIndex}
                              onChange={() => setCorrect(qIndex, oIndex)}
                              className="w-4 h-4 accent-indigo-600"
                            />
                            <input
                              value={opt}
                              onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                              className={`flex-1 border rounded px-3 py-1 outline-none ${errors[`o-${currentPage}-${qIndex}`] && !opt.trim() ? "border-red-500" : "border-gray-200 focus:ring-1 focus:ring-indigo-300"}`}
                              placeholder={`Option ${oIndex + 1}`}
                            />
                            <button onClick={() => removeOption(qIndex, oIndex)} className="text-gray-300 hover:text-red-500">✕</button>
                          </div>
                        ))}
                        <button onClick={() => addOption(qIndex)} className="text-indigo-600 text-sm font-medium hover:underline">+ Add option</button>
                      </>
                    )}
                    {errors[`o-${currentPage}-${qIndex}`] && <p className="text-red-500 text-xs mt-1">{errors[`o-${currentPage}-${qIndex}`]}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-6 border-t">
              <button onClick={addQuestion} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">
                + Add Question
              </button>
              <div className="space-x-4">
                <button onClick={() => setStep(1)} className="text-gray-500 hover:text-gray-700">Back</button>
                <button onClick={handleFinish} className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg shadow-md transition-colors font-bold">
                  FINISH & PUBLISH
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Add_Quiz;