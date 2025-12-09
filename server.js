const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse JSON bodies
app.use(express.json());

// API endpoint to generate math problems
app.post('/api/generate-problems', (req, res) => {
    const { type, count = 5, difficulty = 'easy' } = req.body;
    const problems = [];

    for (let i = 0; i < count; i++) {
        problems.push(generateProblem(type, difficulty));
    }

    res.json({ problems });
});

function generateProblem(type, difficulty) {
    let maxNum, minNum;

    switch (difficulty) {
        case 'easy':
            minNum = 1;
            maxNum = 10;
            break;
        case 'medium':
            minNum = 10;
            maxNum = 100;
            break;
        case 'hard':
            minNum = 100;
            maxNum = 1000;
            break;
        default:
            minNum = 1;
            maxNum = 10;
    }

    const num1 = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    const num2 = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;

    switch (type) {
        case 'addition':
            return {
                num1,
                num2,
                operator: '+',
                answer: num1 + num2,
                question: `${num1} + ${num2} = ?`
            };
        case 'subtraction':
            // Ensure positive result for children
            const larger = Math.max(num1, num2);
            const smaller = Math.min(num1, num2);
            return {
                num1: larger,
                num2: smaller,
                operator: '-',
                answer: larger - smaller,
                question: `${larger} - ${smaller} = ?`
            };
        case 'multiplication':
            // Keep multiplication simpler for beginners
            const mult1 = Math.floor(Math.random() * 12) + 1;
            const mult2 = Math.floor(Math.random() * 12) + 1;
            return {
                num1: mult1,
                num2: mult2,
                operator: '×',
                answer: mult1 * mult2,
                question: `${mult1} × ${mult2} = ?`
            };
        case 'division':
            // Generate clean division problems (no remainders)
            const divisor = Math.floor(Math.random() * 11) + 1;
            const quotient = Math.floor(Math.random() * 11) + 1;
            const dividend = divisor * quotient;
            return {
                num1: dividend,
                num2: divisor,
                operator: '÷',
                answer: quotient,
                question: `${dividend} ÷ ${divisor} = ?`
            };
        default:
            return generateProblem('addition', difficulty);
    }
}

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🎓 Kaelyn's Math Learning Website is running!`);
    console.log(`📚 Open http://localhost:${PORT} in your browser`);
});
