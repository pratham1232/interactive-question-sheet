# 📘 Interactive Question Management Sheet

An interactive web application to manage topics, sub-topics, and questions for structured preparation (DSA sheets, study plans, etc.).

This project is built as part of an assignment and includes **all required features along with multiple bonus enhancements** focusing on usability, UI/UX, and real-world applicability.

---

## 🚀 Tech Stack

- **React.js**
- **Zustand** (state management)
- **@hello-pangea/dnd** (drag & drop)
- **Bootstrap + Tailwind CSS**
- **LocalStorage** (data persistence)

---

## ✅ Core Features (As Required)

### 📌 Topic Management
- Add new topics
- Edit topic names
- Delete topics with **UI-based confirmation**
- Expand / Collapse individual topics
- Expand All / Collapse All topics

### 📌 Sub-topic Management
- Add sub-topics under topics
- Edit sub-topic titles
- Delete sub-topics
- Drag & drop reordering of sub-topics

### 📌 Question Management
- Add questions under sub-topics
- Edit question titles
- Delete questions
- Mark questions as solved/unsolved
- Drag & drop reordering of questions

---

## 🎯 Bonus Features (Added for Extra Points)

### ⭐ Global Progress Tracker
- Shows:
  - Total questions
  - Solved questions
  - Completion percentage
- Visual progress bar at the top of the sheet

### ⭐ Search (Deep Search)
- Improves discoverability for large sheets

### ⭐ Solved Filter
- Filter questions by:
  - All
  - Solved
  - Unsolved
- Helps focus on pending questions

### ⭐ Drag & Drop (Advanced)
- Reorder:
  - Topics
  - Sub-topics
  - Questions
- Smooth UX using `@hello-pangea/dnd`

### ⭐ UI-based Confirmations (No Alerts)
- Delete confirmations handled inside UI
- Edit actions performed inline (no browser popups)

### ⭐ Dark Mode / Light Mode
- Theme toggle with persistence
- Improved readability for long study sessions

### ⭐ Import / Export (JSON)
- Export entire sheet as JSON
- Import JSON to restore or share sheets
- Useful for backups and collaboration

### ⭐ LocalStorage Persistence
- Data automatically saved
- Reload-safe (data remains after refresh)

---

## 🧠 Design & UX Highlights

- Clean card-based layout
- Clickable question text toggles checkbox
- Reduced scrolling using better spacing
- Smooth transitions and hover effects
- Mobile-responsive UI

---

## 📂 Project Structure (Simplified)

