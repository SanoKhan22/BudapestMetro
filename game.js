// Budapest Metro Stations Data
const metroData = {
    M1: {
        name: "M1 (Yellow Line)",
        color: "#FFD800",
        stations: [
            "Vörösmarty tér",
            "Deák Ferenc tér",
            "Bajcsy-Zsilinszky út",
            "Opera",
            "Oktogon",
            "Vörösmarty utca",
            "Kodály körönd",
            "Bajza utca",
            "Hősök tere",
            "Széchenyi fürdő",
            "Mexikói út"
        ]
    },
    M2: {
        name: "M2 (Red Line)",
        color: "#E62E2D",
        stations: [
            "Déli pályaudvar",
            "Széll Kálmán tér",
            "Batthyány tér",
            "Kossuth Lajos tér",
            "Deák Ferenc tér",
            "Astoria",
            "Blaha Lujza tér",
            "Keleti pályaudvar",
            "Puskás Ferenc Stadion",
            "Pillangó utca",
            "Örs vezér tere"
        ]
    },
    M3: {
        name: "M3 (Blue Line)",
        color: "#2C58A0",
        stations: [
            "Újpest-központ",
            "Újpest-városkapu",
            "Gyöngyösi utca",
            "Forgách utca",
            "Göncz Árpád városközpont",
            "Dózsa György út",
            "Lehel tér",
            "Nyugati pályaudvar",
            "Arany János utca",
            "Deák Ferenc tér",
            "Ferenciek tere",
            "Kálvin tér",
            "Corvin-negyed",
            "Klinikák",
            "Nagyvárad tér",
            "Népliget",
            "Ecseri út",
            "Pöttyös utca",
            "Határ út",
            "Kőbánya-Kispest"
        ]
    },
    M4: {
        name: "M4 (Green Line)",
        color: "#009150",
        stations: [
            "Keleti pályaudvar",
            "Rákóczi tér",
            "II. János Pál pápa tér",
            "Kelvin tér",
            "Fővám tér",
            "Szent Gellért tér",
            "Móricz Zsigmond körtér",
            "Gellért tér",
            "Bikás park",
            "Újbuda-központ",
            "Kelenföld vasútállomás"
        ]
    }
};

// Game state
let gameState = {
    score: 0,
    currentQuestion: 0,
    totalQuestions: 10,
    streak: 0,
    bestStreak: 0,
    correctAnswers: 0,
    difficulty: 'medium',
    usedQuestions: []
};

// Question types
const questionTypes = [
    {
        type: 'whichLine',
        generate: () => {
            const lines = Object.keys(metroData);
            const randomLine = lines[Math.floor(Math.random() * lines.length)];
            const stations = metroData[randomLine].stations;
            const station = stations[Math.floor(Math.random() * stations.length)];
            
            return {
                question: `Which metro line is "${station}" on?`,
                correctAnswer: randomLine,
                options: lines,
                line: randomLine
            };
        }
    },
    {
        type: 'stationOnLine',
        generate: () => {
            const lines = Object.keys(metroData);
            const randomLine = lines[Math.floor(Math.random() * lines.length)];
            const stations = metroData[randomLine].stations;
            const correctStation = stations[Math.floor(Math.random() * stations.length)];
            
            // Get wrong options from other lines
            const wrongOptions = [];
            const otherLines = lines.filter(l => l !== randomLine);
            otherLines.forEach(line => {
                const otherStations = metroData[line].stations;
                wrongOptions.push(otherStations[Math.floor(Math.random() * otherStations.length)]);
            });
            
            const options = shuffleArray([correctStation, ...wrongOptions.slice(0, 3)]);
            
            return {
                question: `Which station is on the ${metroData[randomLine].name}?`,
                correctAnswer: correctStation,
                options: options,
                line: randomLine
            };
        }
    },
    {
        type: 'terminalStation',
        generate: () => {
            const lines = Object.keys(metroData);
            const randomLine = lines[Math.floor(Math.random() * lines.length)];
            const stations = metroData[randomLine].stations;
            const isStartTerminal = Math.random() > 0.5;
            const correctAnswer = isStartTerminal ? stations[0] : stations[stations.length - 1];
            
            // Get wrong options
            const wrongOptions = [];
            stations.forEach(s => {
                if (s !== correctAnswer && wrongOptions.length < 3) {
                    wrongOptions.push(s);
                }
            });
            
            const options = shuffleArray([correctAnswer, ...wrongOptions.slice(0, 3)]);
            
            return {
                question: `Which is a terminal station on the ${metroData[randomLine].name}?`,
                correctAnswer: correctAnswer,
                options: options,
                line: randomLine
            };
        }
    }
];

// Utility functions
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Initialize game
function initGame() {
    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('restart-btn').addEventListener('click', resetGame);
    
    // Difficulty selection
    document.querySelectorAll('.btn-difficulty').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.btn-difficulty').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            gameState.difficulty = e.target.dataset.difficulty;
            
            // Adjust total questions based on difficulty
            if (gameState.difficulty === 'easy') {
                gameState.totalQuestions = 5;
            } else if (gameState.difficulty === 'medium') {
                gameState.totalQuestions = 10;
            } else {
                gameState.totalQuestions = 15;
            }
        });
    });
}

function startGame() {
    gameState.score = 0;
    gameState.currentQuestion = 0;
    gameState.streak = 0;
    gameState.bestStreak = 0;
    gameState.correctAnswers = 0;
    gameState.usedQuestions = [];
    
    updateStats();
    showScreen('question-screen');
    generateQuestion();
}

function resetGame() {
    showScreen('start-screen');
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function generateQuestion() {
    if (gameState.currentQuestion >= gameState.totalQuestions) {
        endGame();
        return;
    }
    
    // Select random question type
    const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    const questionData = questionType.generate();
    
    // Display question
    document.getElementById('line-name').textContent = metroData[questionData.line].name;
    document.getElementById('line-name').style.backgroundColor = metroData[questionData.line].color;
    document.getElementById('question-text').textContent = questionData.question;
    
    // Clear previous feedback
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback';
    
    // Display options
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    
    questionData.options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.addEventListener('click', () => checkAnswer(option, questionData.correctAnswer));
        optionsContainer.appendChild(button);
    });
    
    gameState.currentQuestion++;
    updateStats();
}

function checkAnswer(selected, correct) {
    const feedback = document.getElementById('feedback');
    const optionButtons = document.querySelectorAll('.option-btn');
    
    // Disable all buttons
    optionButtons.forEach(btn => btn.disabled = true);
    
    if (selected === correct) {
        feedback.textContent = '✓ Correct!';
        feedback.className = 'feedback correct';
        gameState.score += 10;
        gameState.correctAnswers++;
        gameState.streak++;
        
        if (gameState.streak > gameState.bestStreak) {
            gameState.bestStreak = gameState.streak;
        }
        
        // Highlight correct answer
        optionButtons.forEach(btn => {
            if (btn.textContent === correct) {
                btn.classList.add('correct');
            }
        });
    } else {
        feedback.textContent = `✗ Wrong! The correct answer is: ${correct}`;
        feedback.className = 'feedback incorrect';
        gameState.streak = 0;
        
        // Highlight correct and wrong answers
        optionButtons.forEach(btn => {
            if (btn.textContent === correct) {
                btn.classList.add('correct');
            } else if (btn.textContent === selected) {
                btn.classList.add('incorrect');
            }
        });
    }
    
    updateStats();
    
    // Move to next question after delay
    setTimeout(() => {
        generateQuestion();
    }, 2000);
}

function updateStats() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('question-number').textContent = `${gameState.currentQuestion}/${gameState.totalQuestions}`;
    document.getElementById('streak').textContent = gameState.streak;
}

function endGame() {
    document.getElementById('final-score').textContent = gameState.score;
    document.getElementById('correct-answers').textContent = gameState.correctAnswers;
    document.getElementById('best-streak').textContent = gameState.bestStreak;
    
    // Performance message
    const percentage = (gameState.correctAnswers / gameState.totalQuestions) * 100;
    let message = '';
    
    if (percentage === 100) {
        message = '🏆 Perfect! You know Budapest Metro like a local!';
    } else if (percentage >= 80) {
        message = '🌟 Excellent! You really know your way around!';
    } else if (percentage >= 60) {
        message = '👍 Good job! Keep practicing!';
    } else if (percentage >= 40) {
        message = '🚇 Not bad! Take the metro more often!';
    } else {
        message = '📚 Keep learning! Budapest Metro is fascinating!';
    }
    
    document.getElementById('performance-message').textContent = message;
    
    showScreen('result-screen');
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initGame);
