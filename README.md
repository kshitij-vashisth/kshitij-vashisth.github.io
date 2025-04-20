# 🧠 Personal Portfolio

This is the source code for my interactive, animated, and responsive developer portfolio — built with **React**, styled using **TailwindCSS**, and hosted via **GitHub Pages**.

🔗 **Live Site**: [kshitij-vashisth.github.io](https://kshitij-vashisth.github.io)

---

## ⚙️ Tech Stack

- **Framework**: React (with Vite)
- **Styling**: TailwindCSS, CSS animations
- **3D Rendering**: Three.js (`BrainCanvas`)
- **Audio**: HTML5 Audio API
- **Custom Components**: Modular React architecture

---

## 🚀 Features

- 🎨 Responsive layout (desktop & mobile)
- 🧠 Animated brain canvas (desktop only)
- 🎧 Toggleable background music
- 💼 Project showcase section
- 🌀 Rotating tech sphere
- 🔁 Scrolling tech stack banners
- 📝 Personal info & contact

---

## 🗂️ Folder Structure

```bash
src/
├── App.jsx               # Main app component
├── App.css               # Global styles
├── Cursors.css           # Cursor styling
├── assets/
│   └── music/            # Background music
├── components/           # Custom components
│   ├── BrainCanvas.jsx
│   ├── Footer.jsx
│   ├── Headline.jsx
│   ├── Intro.jsx
│   ├── Navbar.jsx
│   ├── PersonalInfo.jsx
│   ├── Projects.jsx
│   ├── RotatingSphere.jsx
│   └── StreamerText.jsx
```

---

## 🧑‍💻 Local Setup

To run this project locally:

### Prerequisites

- Node.js (v22.13.0)
- npm or yarn

### Steps

```bash
git clone https://github.com/kshitij-vashish/kshitij-vashish.github.io.git
cd kshitij-vashish.github.io
npm install
npm run dev

Then open your browser at: `http://localhost:5173`

---

## 📦 Deployment

Deployed via **GitHub Pages** using the `gh-pages` branch via git workflows.