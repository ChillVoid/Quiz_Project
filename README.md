# 📘 DCIT 26 – Online Quiz Application

## 📝 Project Description

The **Online Quiz Application** is a web-based system developed as a final project for **DCIT 26**. It allows students to take a timed quiz under controlled conditions while enabling instructors to manage quiz results and release scores when appropriate.

The application emphasizes **academic integrity**, **user role separation**, and **clean UI/UX**, using modern web technologies such as **React**, **Vite**, and **TailwindCSS**.

---

## 🎯 Project Objectives

- Build a functional quiz system using React
- Prevent quiz retakes and minimize cheating behavior
- Implement tab-switch / focus detection
- Separate student and instructor functionalities
- Deploy a working web application

---

## 👥 User Roles

### 👨‍🎓 Student
- Take a timed quiz
- Answer questions loaded from a local JSON or mock backend
- Receive warnings when switching browser tabs or minimizing the window
- Auto-submit the quiz after excessive violations
- Wait for instructor approval before viewing scores

### 👩‍🏫 Instructor (Admin)
- View student quiz submissions
- Monitor scores, violations, and submission timestamps
- Release quiz results to students

---

## ✨ Core Features

### 🧠 Student Features

- **Timed Quiz**
  - Visible countdown timer
  - Questions loaded from JSON data

- **Quiz Retake Prevention**
  - Detects if the quiz has already been taken
  - Displays:
    > *“You have already taken this quiz. Please wait for the instructor to release your score.”*

- **Tab Switch / Focus Detection**
  - Detects tab switching or window minimization
  - Displays warning popups
  - Logs violations
  - Automatically submits the quiz after reaching a violation threshold (e.g., 3)

- **Score Visibility Control**
  - Students do not see scores immediately
  - Displays:
    > *“Your answers have been submitted. Please wait for the instructor to release the results.”*

---

### 🛠 Instructor Features

- **View Student Results**
  - Student Name
  - Score
  - Number of Violations
  - Submission Date and Time

- **Release Results**
  - Instructor releases results via a button
  - Student dashboards update automatically
  - Scores become visible after release

---

> The core quiz logic (timer, navigation, violations, submission) is handled in **View_Quiz.jsx**.

---

## 🔄 Application Flow

1. Student opens the application  
2. System checks if the quiz was already taken  
3. Student starts the quiz  
4. Timer and tab monitoring begin  
5. Violations are logged if focus changes  
6. Quiz is submitted manually or automatically  
7. Results are stored  
8. Instructor reviews submissions  
9. Instructor releases results  
10. Student views final score  

---

## 👨‍👩‍👧‍👦 Team Members

| Name |  
|------|------|
| Manansala, Ever Mae | 
| Mañibo, Rhalp | 
| Matavia, Angelo | 
| Navarette, Kurt Eris |
| Olivo, Paul Emmanuel | 
| Omboy, Maria Princes |  
| Pelone, John Dave | 
| Petilla, Clarisse Jane | 

---

## ❓ Frequently Asked Questions (FAQs)

### 1. What is the purpose of this application?
This application was developed to provide a secure and structured online quiz system where students can take quizzes while instructors manage and release results.

---

### 2. Who can use this system?
The system supports two user roles:
- **Students**, who can take quizzes and wait for results
- **Instructors (Admin)**, who can monitor submissions and release scores

---

### 3. How does the system prevent quiz retakes?
The application checks if a student has already completed the quiz using **localStorage** or a mock backend. If a quiz attempt already exists, the student is blocked from retaking the quiz.

---

### 4. Why can’t students see their scores immediately after submitting?
To ensure fairness and consistency, quiz results are only shown after the **instructor releases the results**. Until then, students will see a pending status message.

---

### 5. How does tab-switch or focus detection work?
The system listens for browser focus and visibility changes. When a student switches tabs or minimizes the browser:
- A warning popup is displayed
- The action is recorded as a violation
- Reaching a set violation limit will automatically submit the quiz

---

### 6. What happens when the violation limit is reached?
Once the violation threshold (e.g., 3 violations) is reached, the quiz is **automatically submitted** to prevent further misconduct.

---

### 7. Is a backend server required to run this project?
No. The project can run using a **local JSON file** and **localStorage** as a mock backend. However, it can be extended with a real backend if needed.

---

### 8. What technologies were used to build this project?
- React.js  
- Vite  
- React Hooks for state management  

---


### 11. Can this project be extended in the future?
Yes. The system was designed with scalability in mind and can be enhanced in the future by adding more features, improving data handling, or integrating a full backend service if required.

---





