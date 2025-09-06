# SimpleTodoApp

**SimpleTodoApp** is a lightweight, browser‑based todo list application. It lets users add, complete, and delete tasks, with all data stored locally in the browser’s `localStorage` so that todos persist across sessions. The app is built with vanilla HTML, CSS, and JavaScript and is fully responsive for desktop and mobile devices.

---

## Tech Stack
- **HTML** – Structure of the application.
- **CSS** – Styling and responsive layout.
- **JavaScript** – Core functionality, event handling, and persistence via `localStorage`.

---

## Features
- **Add Todo** – Type a task and press **Enter** or click the add button.
- **Mark as Completed** – Click the checkbox next to a task to toggle its completed state.
- **Delete Todo** – Click the delete (✖) icon to remove a task.
- **Clear Completed** – One‑click button that removes all tasks marked as completed.
- **Persistence** – All todos are saved in `localStorage`, so they remain after page reloads or browser restarts.
- **Responsive Design** – Layout adapts to different screen sizes; works well on mobile, tablet, and desktop.

---

## Setup Instructions
1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/simple-todo-app.git
   cd simple-todo-app
   ```
2. **Open the app**
   - Simply open `index.html` in your favorite web browser (no server required).
   - You can double‑click the file or run:
     ```bash
     open index.html   # macOS
     start index.html  # Windows
     ```

---

## Usage Guide
1. **Add a Todo**
   - Type your task into the input field at the top.
   - Press **Enter** or click the **Add** button.
2. **Complete a Todo**
   - Click the checkbox next to a task. The task text will be crossed out, indicating completion.
3. **Delete a Todo**
   - Click the **✖** (delete) icon on the right side of a task to remove it.
4. **Clear Completed Todos**
   - Click the **Clear Completed** button at the bottom to remove all tasks that are marked as completed.
5. **Persistence**
   - All changes are automatically saved to `localStorage`. Closing and reopening the browser will retain your todo list.

---

## Responsive Design & Mobile Testing
- The app uses flexible CSS grid/flexbox layouts and media queries to adapt to various screen widths.
- To test on mobile:
  1. Open the app in a desktop browser.
  2. Open the developer tools (F12) and toggle the device toolbar.
  3. Choose a mobile viewport (e.g., iPhone X) to see the responsive layout.
  4. Alternatively, open the `index.html` directly on a mobile device’s browser.

---

## License
[Insert License Here]

---

*This README provides an overview for both end‑users and developers, referencing the core files (`index.html`, `styles.css`, `app.js`) that make up SimpleTodoApp.*