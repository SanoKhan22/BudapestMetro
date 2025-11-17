# 🚇 Budapest Metro Game

A single-player strategy game where you build Budapest's metro network across a 10×10 grid. Draw station cards, connect stations strategically, and maximize your score through district coverage, Danube crossings, and junction creation.

![Game Status](https://img.shields.io/badge/status-in%20development-yellow)
![JavaScript](https://img.shields.io/badge/javascript-ES6+-blue)
![No Framework](https://img.shields.io/badge/framework-vanilla%20JS-green)

## 🎮 Game Overview

Build 4 metro lines (M1/Yellow, M2/Red, M3/Blue, M4/Green) across Budapest's grid by:
- Drawing station cards (A, B, C, D, Joker, Switch)
- Connecting stations following strict placement rules
- Scoring points for strategic planning

### Scoring System
- **Round Score:** (Districts × Max in District) + Danube Crossings
- **Railway Points:** Bonus for visiting train stations
- **Junction Bonus:** 2pts (2 lines), 5pts (3 lines), 9pts (4 lines)

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/budapest-metro-game.git
   cd budapest-metro-game
   ```

2. **Open in browser**
   ```bash
   # Simply open index.html in your browser
   open index.html
   # or
   # Use a local server (recommended)
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

3. **Play the game**
   - Enter your name
   - Click "Játék indítása" (Start Game)
   - Follow the on-screen instructions

## 📋 Features

### ✅ Implemented
- [x] Menu system with player name input
- [x] Game rules and help modal
- [x] 10×10 grid rendering with stations
- [x] Timer functionality
- [x] Leaderboard with local storage
- [x] Responsive design

### 🚧 In Progress
- [ ] Card drawing system
- [ ] Segment building with validation
- [ ] Round management
- [ ] Scoring calculations
- [ ] Switch card functionality
- [ ] Abilities mode

## 🛠️ Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling (Grid, Flexbox, CSS Variables)
- **Vanilla JavaScript (ES6+)** - No frameworks
- **Local Storage API** - Game history persistence

### Code Quality Standards
- ✅ Uses `const`/`let` only (no `var`)
- ✅ Uses `querySelector`/`querySelectorAll` only
- ✅ Uses `addEventListener` only (no inline handlers)
- ✅ No `alert()`, `prompt()`, or `document.write()`
- ✅ Modular architecture (MVC pattern)

## 📁 Project Structure

```
budapest-metro-game/
├── index.html              # Main entry point
├── README.md               # This file
│
├── css/
│   ├── styles.css          # Global styles
│   ├── menu.css            # Menu screen
│   ├── game.css            # Game screen
│   └── grid.css            # Grid and stations
│
├── js/
│   ├── constants.js        # Game constants
│   ├── models/             # Data models
│   │   ├── GameState.js
│   │   ├── Station.js
│   │   ├── MetroLine.js
│   │   └── Card.js
│   ├── controllers/        # Game logic
│   ├── views/              # UI rendering
│   │   ├── MenuView.js
│   │   └── GridView.js
│   ├── utils/              # Helper functions
│   │   └── storage.js
│   └── app.js              # Application entry
│
├── data/
│   ├── stations.json       # Station data
│   └── lines.json          # Metro line data
│
└── assets/
    └── images/             # SVG icons
```

## 🎯 Game Rules

### Placement Rules
- Segments must be straight (90° or 45° angles)
- Cannot intersect other segments (except at stations)
- Cannot pass through intermediate stations
- Cannot create loops (revisit stations on same line)
- Only one segment between any two stations
- Must match card type to target station type

### Special Elements
- **Joker Card:** Connects to any station type
- **Joker Station (Deák tér):** Accepts any card type
- **Switch Card:** Create branches from any visited station
- **Railway Stations:** Bonus points on special slider

## 🎨 Screenshots

_Screenshots coming soon..._

## 🤝 Contributing

This is an educational project. Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Development

### Prerequisites
- Modern web browser (Chrome 60+, Firefox 60+, Safari 12+, Edge 79+)
- Text editor or IDE
- Basic knowledge of HTML, CSS, and JavaScript

### Development Guidelines
- Follow the existing code style
- Use `const`/`let`, never `var`
- Use `querySelector`, never `getElementById`
- Use `addEventListener`, never inline handlers
- Keep functions small and focused
- Update documentation when adding features

## 📄 License

This project is created for educational purposes as part of a JavaScript course assignment.

## 🙏 Acknowledgments

- Game concept based on Budapest's historic metro network
- Station and line data provided in course starter package
- Inspired by strategy board games

## 📞 Contact

**Project Link:** [https://github.com/yourusername/budapest-metro-game](https://github.com/yourusername/budapest-metro-game)

---

**Note:** This is a work in progress. Check back for updates!

## 🗺️ Roadmap

- [x] Phase 1: Project setup and foundation
- [x] Phase 2: Menu system
- [x] Phase 3: Grid rendering
- [ ] Phase 4: Card system
- [ ] Phase 5: Segment building
- [ ] Phase 6: Scoring system
- [ ] Phase 7: Extra features
- [ ] Phase 8: Polish and testing

**Current Progress:** ~22% Complete

---

Made with ❤️ for Budapest's metro network
