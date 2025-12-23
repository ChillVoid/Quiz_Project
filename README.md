# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

📁 Project Scope Reviewed

Main files involved

App.jsx

Dashboard.jsx

Login.jsx

Navbar.jsx

Selection/View_Quiz.jsx

Selection/Add_Quiz.jsx

Selection/Update_Quiz.jsx

Quiz data files (quizData.js, JSON assets)

The core logic and state complexity lives in View_Quiz.jsx, so most insights are centered there.

🧠 STATE MANAGEMENT INSIGHTS (useState)
View_Quiz.jsx
quiz

Purpose

Stores the full quiz object (questions, options, correct answers)

How it’s used

Initialized after loading quiz data

Acts as the single source of truth for rendering questions

Why it matters

Prevents repeated data fetching

Allows question navigation without data loss

currentPage

Purpose

Tracks the current question index

How it’s updated

Incremented / decremented via navigation handlers

Why it matters

Enables pagination logic

Prevents rendering multiple questions at once

answers

Purpose

Stores user-selected answers per question
(key = question index, value = selected option)

How it’s updated

Updated immutably when the user selects an option

Why it matters

Allows answer persistence when navigating between questions

Makes quiz submission and validation possible

timeRemaining

Purpose

Countdown timer value (seconds)

How it’s updated

Decrements via setInterval inside useEffect

Why it matters

Enables time-limited quizzes

Triggers auto-submit or lock when time expires

tabSwitchCount

Purpose

Tracks how many times the user leaves the tab

How it’s updated

Incremented on visibilitychange event

Why it matters

Anti-cheating mechanism

Can auto-submit or disqualify after threshold

isFinished

Purpose

Flags whether the quiz is completed

How it’s updated

Set to true on submission or timeout

Why it matters

Prevents further interaction

Switches UI to results mode

🧠 Add_Quiz.jsx / Update_Quiz.jsx (Form State)
Form-related states

Examples:

quiz title

questions array

options

correct answer index

Purpose

Controls form inputs

Ensures controlled components

Why it matters

Prevents uncontrolled input bugs

Enables validation before submit

🎯 HANDLER FUNCTIONS (Event Logic)
View_Quiz.jsx
handleAnswerSelect(questionIndex, option)

Triggered by

Clicking an answer option

What it does

Updates answers state immutably

Impact

Records user input without mutating state

Ensures React re-render consistency

handleNext() / handlePrev()

Triggered by

Navigation buttons

What they do

Adjust currentPage

Prevent overflow (first / last question)

Impact

Smooth quiz navigation

Prevents index out-of-bounds errors

handleSubmit()

Triggered by

Submit button or timer expiration

What it does

Finalizes quiz

Sets isFinished

Stops timers and listeners

Impact

Locks quiz state

Prevents further changes to answers

handleVisibilityChange()

Triggered by

Browser tab switch

What it does

Increments tabSwitchCount

Optionally auto-submits quiz

Impact

Anti-cheating logic

Enforces quiz rules without backend dependency

Add / Update Quiz Handlers
handleInputChange

Purpose

Updates form field state

handleAddQuestion

Purpose

Appends a new question object

handleUpdateQuestion

Purpose

Modifies existing question data

handleSaveQuiz

Purpose

Validates and persists quiz data

⚠️ ERROR HANDLING & SAFETY LOGIC
Defensive Rendering

Components check if quiz exists before rendering

Prevents undefined access crashes

Timer Cleanup

clearInterval used in useEffect cleanup

Why this matters

Prevents memory leaks

Prevents multiple timers running in parallel

Navigation Bounds Checking

currentPage is clamped

Prevents invalid array access

Input Validation (Forms)

Ensures required fields exist

Prevents saving incomplete quizzes
