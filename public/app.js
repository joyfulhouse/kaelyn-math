// ==========================================
// Kaelyn's Math Adventure - Main Application
// ==========================================

// Global State
let currentStackedOperation = 'addition';
let stackedProblem = { num1: 245, num2: 132, answer: 377 };
let multQuizScore = { correct: 0, total: 0 };
let divQuizScore = { correct: 0, total: 0 };
let currentMultQuiz = { a: 0, b: 0, answer: 0 };
let currentDivQuiz = { a: 0, b: 0, answer: 0 };
let practiceProblems = [];
let currentPracticeIndex = 0;
let practiceScore = 0;
let currentPVQuiz = { number: 0, place: '', answer: 0 };
let practiceType = 'mixed';

// Session state (loaded from server)
let sessionState = null;

// ==========================================
// Session State Management
// ==========================================
async function loadSessionState() {
    try {
        const response = await fetch('/api/state');
        const data = await response.json();
        if (data.success) {
            sessionState = data.state;
            updateUIFromState();
        }
    } catch (error) {
        console.error('Failed to load session state:', error);
    }
}

async function saveSessionState(updates) {
    try {
        const response = await fetch('/api/state', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        const data = await response.json();
        if (data.success) {
            sessionState = data.state;
            updateUIFromState();
        }
    } catch (error) {
        console.error('Failed to save session state:', error);
    }
}

async function recordLessonVisit(lesson) {
    try {
        await fetch('/api/lesson/visit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lesson })
        });
    } catch (error) {
        console.error('Failed to record lesson visit:', error);
    }
}

async function updateModuleProgress(module, updates) {
    try {
        const response = await fetch(`/api/progress/${module}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        const data = await response.json();
        if (data.success && sessionState) {
            sessionState[module] = data.data;
            updateUIFromState();
        }
    } catch (error) {
        console.error('Failed to update module progress:', error);
    }
}

async function recordPracticeSession(correct, total, type) {
    try {
        const response = await fetch('/api/practice/record', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correct, total, type })
        });
        const data = await response.json();
        if (data.success && sessionState) {
            sessionState.practice = data.practice;
            sessionState.totalStars = data.totalStars;
            updateUIFromState();
            return data.starsEarned;
        }
    } catch (error) {
        console.error('Failed to record practice session:', error);
    }
    return 0;
}

function updateUIFromState() {
    if (!sessionState) return;

    // Update star display in header
    const starDisplay = document.getElementById('total-stars-display');
    if (starDisplay) {
        starDisplay.textContent = sessionState.totalStars || 0;
    }

    // Update welcome message with name
    const welcomeH2 = document.querySelector('.welcome-card h2');
    if (welcomeH2 && sessionState.userName) {
        welcomeH2.innerHTML = `Welcome, ${sessionState.userName}! 🌟`;
    }

    // Update progress stats display
    updateProgressDisplay();
}

function updateProgressDisplay() {
    if (!sessionState) return;

    const statsContainer = document.getElementById('progress-stats');
    if (statsContainer) {
        const practice = sessionState.practice || {};
        const accuracy = practice.totalProblems > 0
            ? Math.round((practice.totalCorrect / practice.totalProblems) * 100)
            : 0;

        statsContainer.innerHTML = `
            <div class="stat-item">
                <span class="stat-value">${practice.totalSessions || 0}</span>
                <span class="stat-label">Sessions</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${practice.totalProblems || 0}</span>
                <span class="stat-label">Problems</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${accuracy}%</span>
                <span class="stat-label">Accuracy</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${practice.bestScore || 0}%</span>
                <span class="stat-label">Best Score</span>
            </div>
        `;
    }
}

// ==========================================
// Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    // Load session state first
    await loadSessionState();

    createStars();
    updatePlaceValues();
    updateMultVisual();
    showTimesTable();
    updateDivVisual();
    newMultQuiz();
    newDivQuiz();
    newStackedProblem();
});

// Create background stars
function createStars() {
    const container = document.getElementById('stars');
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.width = (Math.random() * 3 + 1) + 'px';
        star.style.height = star.style.width;
        star.style.animationDelay = Math.random() * 3 + 's';
        container.appendChild(star);
    }
}

// ==========================================
// Navigation
// ==========================================
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    document.getElementById(sectionId).classList.add('active');

    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.section === sectionId) {
            btn.classList.add('active');
        }
    });

    // Record lesson visit
    if (sectionId !== 'home') {
        recordLessonVisit(sectionId);
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// Place Value Functions
// ==========================================
function updatePlaceValues() {
    const input = document.getElementById('pv-input');
    let num = parseInt(input.value) || 0;

    // Clamp to valid range
    if (num < 0) num = 0;
    if (num > 9999) num = 9999;
    input.value = num;

    const thousands = Math.floor(num / 1000);
    const hundreds = Math.floor((num % 1000) / 100);
    const tens = Math.floor((num % 100) / 10);
    const ones = num % 10;

    // Update boxes with animation
    animateNumber('pv-thousands', thousands);
    animateNumber('pv-hundreds', hundreds);
    animateNumber('pv-tens', tens);
    animateNumber('pv-ones', ones);

    // Update breakdown
    document.getElementById('pv-breakdown').innerHTML = `
        <p>The number <strong>${num}</strong> has:</p>
        <ul>
            <li><span class="highlight thousands">${thousands}</span> thousands (${thousands} × 1000 = ${thousands * 1000})</li>
            <li><span class="highlight hundreds">${hundreds}</span> hundreds (${hundreds} × 100 = ${hundreds * 100})</li>
            <li><span class="highlight tens">${tens}</span> tens (${tens} × 10 = ${tens * 10})</li>
            <li><span class="highlight ones">${ones}</span> ones (${ones} × 1 = ${ones})</li>
        </ul>
        <p style="margin-top: 1rem; font-size: 1.1rem;">
            <strong>${thousands * 1000} + ${hundreds * 100} + ${tens * 10} + ${ones} = ${num}</strong>
        </p>
    `;

    // Update visual blocks
    updateBlocksVisual(thousands, hundreds, tens, ones);

    // Track highest number explored
    if (sessionState && num > (sessionState.numberPlaces?.highestNumber || 0)) {
        updateModuleProgress('numberPlaces', { highestNumber: num });
    }
}

function animateNumber(elementId, value) {
    const element = document.getElementById(elementId);
    element.style.transform = 'scale(1.2)';
    element.textContent = value;
    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 200);
}

function updateBlocksVisual(thousands, hundreds, tens, ones) {
    const container = document.getElementById('blocks-visual');
    container.innerHTML = '';

    // Thousands blocks
    if (thousands > 0) {
        const group = createBlockGroup('Thousands', thousands, 'thousand');
        container.appendChild(group);
    }

    // Hundreds blocks
    if (hundreds > 0) {
        const group = createBlockGroup('Hundreds', hundreds, 'hundred');
        container.appendChild(group);
    }

    // Tens blocks
    if (tens > 0) {
        const group = createBlockGroup('Tens', tens, 'ten');
        container.appendChild(group);
    }

    // Ones blocks
    if (ones > 0) {
        const group = createBlockGroup('Ones', ones, 'one');
        container.appendChild(group);
    }

    if (thousands === 0 && hundreds === 0 && tens === 0 && ones === 0) {
        container.innerHTML = '<p style="text-align: center; color: #636e72;">Enter a number to see the blocks!</p>';
    }
}

function createBlockGroup(label, count, type) {
    const group = document.createElement('div');
    group.className = 'block-group';

    const labelDiv = document.createElement('div');
    labelDiv.className = 'block-group-label';
    labelDiv.textContent = `${label} (${count})`;
    group.appendChild(labelDiv);

    const blocksContainer = document.createElement('div');
    blocksContainer.className = 'blocks-container';

    for (let i = 0; i < count; i++) {
        const block = document.createElement('div');
        block.className = `block ${type}`;
        block.style.animationDelay = (i * 0.05) + 's';
        blocksContainer.appendChild(block);
    }

    group.appendChild(blocksContainer);
    return group;
}

function randomPlaceValue() {
    const num = Math.floor(Math.random() * 9999) + 1;
    document.getElementById('pv-input').value = num;
    updatePlaceValues();
}

// Place Value Quiz
function newPlaceValueQuestion() {
    const places = ['thousands', 'hundreds', 'tens', 'ones'];
    const place = places[Math.floor(Math.random() * places.length)];
    const num = Math.floor(Math.random() * 9000) + 1000; // 4-digit number

    let answer;
    switch (place) {
        case 'thousands': answer = Math.floor(num / 1000); break;
        case 'hundreds': answer = Math.floor((num % 1000) / 100); break;
        case 'tens': answer = Math.floor((num % 100) / 10); break;
        case 'ones': answer = num % 10; break;
    }

    currentPVQuiz = { number: num, place, answer };

    document.getElementById('pv-question').innerHTML =
        `What digit is in the <strong>${place}</strong> place in <strong>${num}</strong>?`;

    // Generate options
    const options = [answer];
    while (options.length < 4) {
        const opt = Math.floor(Math.random() * 10);
        if (!options.includes(opt)) {
            options.push(opt);
        }
    }

    // Shuffle options
    options.sort(() => Math.random() - 0.5);

    const optionsContainer = document.getElementById('pv-options');
    optionsContainer.innerHTML = '';

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = opt;
        btn.onclick = () => checkPVAnswer(opt, btn);
        optionsContainer.appendChild(btn);
    });

    document.getElementById('pv-feedback').innerHTML = '';
    document.getElementById('pv-feedback').className = 'feedback';
}

function checkPVAnswer(selected, button) {
    const isCorrect = selected === currentPVQuiz.answer;
    const feedback = document.getElementById('pv-feedback');

    // Disable all options
    document.querySelectorAll('.quiz-option').forEach(btn => {
        btn.style.pointerEvents = 'none';
        if (parseInt(btn.textContent) === currentPVQuiz.answer) {
            btn.classList.add('correct');
        }
    });

    // Update session state
    if (sessionState) {
        const current = sessionState.numberPlaces || {};
        updateModuleProgress('numberPlaces', {
            questionsAttempted: (current.questionsAttempted || 0) + 1,
            questionsCorrect: (current.questionsCorrect || 0) + (isCorrect ? 1 : 0)
        });
    }

    if (isCorrect) {
        feedback.textContent = '🎉 Correct! Great job!';
        feedback.className = 'feedback success';
        celebrate();
    } else {
        button.classList.add('incorrect');
        feedback.textContent = `Not quite! The answer is ${currentPVQuiz.answer}. Try another!`;
        feedback.className = 'feedback error';
    }
}

// ==========================================
// Stacked Math Functions
// ==========================================
function switchStackedTab(operation) {
    currentStackedOperation = operation;

    document.querySelectorAll('.stacked-tabs .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    event.target.classList.add('active');
    newStackedProblem();
}

function newStackedProblem() {
    const isAddition = currentStackedOperation === 'addition';
    let num1, num2;

    if (isAddition) {
        num1 = Math.floor(Math.random() * 900) + 100; // 3-digit
        num2 = Math.floor(Math.random() * 900) + 100;
    } else {
        num1 = Math.floor(Math.random() * 900) + 100;
        num2 = Math.floor(Math.random() * Math.min(num1, 899)) + 100;
        // Ensure num1 > num2 for subtraction
        if (num1 < num2) {
            [num1, num2] = [num2, num1];
        }
    }

    const answer = isAddition ? num1 + num2 : num1 - num2;
    stackedProblem = { num1, num2, answer };

    // Update display
    const num1Str = num1.toString().padStart(4, ' ');
    const num2Str = num2.toString().padStart(3, '0');
    const answerStr = answer.toString();

    document.getElementById('stacked-num1').innerHTML =
        num1Str.split('').map(d => `<span class="digit">${d}</span>`).join('');

    document.getElementById('stacked-operator').textContent = isAddition ? '+' : '-';

    // Update num2 digits
    for (let i = 0; i < 3; i++) {
        document.getElementById(`stacked-num2-${i}`).textContent = num2Str[i];
    }

    // Recreate answer inputs based on answer length
    const answerRow = document.getElementById('stacked-answer-row');
    answerRow.innerHTML = '';
    for (let i = 0; i < answerStr.length; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'digit-input';
        input.id = `ans-${i}`;
        input.maxLength = 1;
        input.oninput = checkStackedAnswer;
        answerRow.appendChild(input);
    }

    // Clear feedback
    document.getElementById('stacked-feedback').innerHTML = '';
    document.getElementById('stacked-feedback').className = 'feedback';

    // Update demo steps
    updateStackedDemo();
}

function updateStackedDemo() {
    const demo = document.getElementById('demo-steps');
    if (currentStackedOperation === 'addition') {
        demo.innerHTML = `
            <ol>
                <li><strong>Line up</strong> the numbers by place value (ones under ones, tens under tens)</li>
                <li><strong>Start from the right</strong> - add the ones place first</li>
                <li>If the sum is 10 or more, <strong>carry the 1</strong> to the next column</li>
                <li>Move left and repeat until you've added all columns!</li>
            </ol>
        `;
    } else {
        demo.innerHTML = `
            <ol>
                <li><strong>Line up</strong> the numbers by place value</li>
                <li><strong>Start from the right</strong> - subtract the ones place first</li>
                <li>If you can't subtract (top number is smaller), <strong>borrow 10</strong> from the next column</li>
                <li>Move left and repeat until you've subtracted all columns!</li>
            </ol>
        `;
    }
}

function checkStackedAnswer() {
    const answerStr = stackedProblem.answer.toString();
    const inputs = document.querySelectorAll('#stacked-answer-row .digit-input');
    let userAnswer = '';
    let allFilled = true;

    inputs.forEach((input, i) => {
        userAnswer += input.value;
        if (!input.value) allFilled = false;

        // Check individual digit
        if (input.value) {
            if (input.value === answerStr[i]) {
                input.classList.add('correct');
                input.classList.remove('incorrect');
            } else {
                input.classList.add('incorrect');
                input.classList.remove('correct');
            }
        } else {
            input.classList.remove('correct', 'incorrect');
        }
    });

    if (allFilled && userAnswer === answerStr) {
        const feedback = document.getElementById('stacked-feedback');
        feedback.textContent = '🎉 Perfect! You got it right!';
        feedback.className = 'feedback success';

        // Update session state
        if (sessionState) {
            const current = sessionState.stackedMath || {};
            if (currentStackedOperation === 'addition') {
                updateModuleProgress('stackedMath', {
                    additionAttempted: (current.additionAttempted || 0) + 1,
                    additionCorrect: (current.additionCorrect || 0) + 1
                });
            } else {
                updateModuleProgress('stackedMath', {
                    subtractionAttempted: (current.subtractionAttempted || 0) + 1,
                    subtractionCorrect: (current.subtractionCorrect || 0) + 1
                });
            }
        }

        celebrate();
    }
}

function showStackedHint() {
    const feedback = document.getElementById('stacked-feedback');
    const answerStr = stackedProblem.answer.toString();

    if (currentStackedOperation === 'addition') {
        feedback.innerHTML = `
            <strong>Hint:</strong> Start from the right!
            Add ${stackedProblem.num1 % 10} + ${stackedProblem.num2 % 10} = ${(stackedProblem.num1 % 10) + (stackedProblem.num2 % 10)}.
            ${(stackedProblem.num1 % 10) + (stackedProblem.num2 % 10) >= 10 ? 'Carry the 1!' : ''}
        `;
    } else {
        const ones1 = stackedProblem.num1 % 10;
        const ones2 = stackedProblem.num2 % 10;
        feedback.innerHTML = `
            <strong>Hint:</strong> Start from the right!
            ${ones1} - ${ones2} = ${ones1 >= ones2 ? ones1 - ones2 : 'You need to borrow!'}
        `;
    }
    feedback.className = 'feedback';
}

function revealStackedAnswer() {
    const answerStr = stackedProblem.answer.toString();
    const inputs = document.querySelectorAll('#stacked-answer-row .digit-input');

    inputs.forEach((input, i) => {
        input.value = answerStr[i];
        input.classList.add('correct');
    });

    const feedback = document.getElementById('stacked-feedback');
    feedback.textContent = `The answer is ${stackedProblem.answer}. Try another problem!`;
    feedback.className = 'feedback';
}

// ==========================================
// Multiplication Functions
// ==========================================
function updateMultVisual() {
    const a = parseInt(document.getElementById('mult-slider-a').value);
    const b = parseInt(document.getElementById('mult-slider-b').value);
    const result = a * b;

    document.getElementById('mult-a').textContent = a;
    document.getElementById('mult-b').textContent = b;
    document.getElementById('mult-result').textContent = result;

    // Create visual grid
    const grid = document.getElementById('mult-grid');
    grid.innerHTML = '';

    for (let i = 0; i < a; i++) {
        const row = document.createElement('div');
        row.className = 'mult-row';
        for (let j = 0; j < b; j++) {
            const dot = document.createElement('div');
            dot.className = 'mult-dot';
            dot.style.animationDelay = ((i * b + j) * 0.02) + 's';
            row.appendChild(dot);
        }
        grid.appendChild(row);
    }

    // Update explanation
    const parts = [];
    for (let i = 0; i < a; i++) {
        parts.push(b);
    }
    document.getElementById('mult-explanation').innerHTML =
        `${a} × ${b} means <strong>${a} groups of ${b}</strong>, or ${parts.join(' + ')} = <strong>${result}</strong>`;
}

function showTimesTable() {
    const num = parseInt(document.getElementById('times-table-select').value);
    const display = document.getElementById('times-table-display');
    display.innerHTML = '';

    for (let i = 1; i <= 12; i++) {
        const item = document.createElement('div');
        item.className = 'times-table-item';
        item.textContent = `${num} × ${i} = ${num * i}`;
        item.style.animationDelay = (i * 0.05) + 's';
        display.appendChild(item);
    }

    // Track which tables have been viewed
    if (sessionState) {
        const current = sessionState.multiplication || {};
        const tablesCompleted = current.tablesCompleted || [];
        if (!tablesCompleted.includes(num)) {
            updateModuleProgress('multiplication', {
                tablesCompleted: [...tablesCompleted, num]
            });
        }
    }
}

function newMultQuiz() {
    const a = Math.floor(Math.random() * 12) + 1;
    const b = Math.floor(Math.random() * 12) + 1;

    currentMultQuiz = { a, b, answer: a * b };

    document.getElementById('mult-quiz-a').textContent = a;
    document.getElementById('mult-quiz-b').textContent = b;
    document.getElementById('mult-quiz-answer').value = '';
    document.getElementById('mult-feedback').innerHTML = '';
    document.getElementById('mult-feedback').className = 'feedback';

    document.getElementById('mult-quiz-answer').focus();
}

function checkMultQuiz() {
    const userAnswer = parseInt(document.getElementById('mult-quiz-answer').value);
    const feedback = document.getElementById('mult-feedback');
    const isCorrect = userAnswer === currentMultQuiz.answer;

    multQuizScore.total++;

    if (isCorrect) {
        multQuizScore.correct++;
        feedback.textContent = '🎉 Correct! Amazing work!';
        feedback.className = 'feedback success';
        celebrate();
    } else {
        feedback.textContent = `Not quite! ${currentMultQuiz.a} × ${currentMultQuiz.b} = ${currentMultQuiz.answer}`;
        feedback.className = 'feedback error';
    }

    // Update session state
    if (sessionState) {
        const current = sessionState.multiplication || {};
        updateModuleProgress('multiplication', {
            questionsAttempted: (current.questionsAttempted || 0) + 1,
            questionsCorrect: (current.questionsCorrect || 0) + (isCorrect ? 1 : 0)
        });
    }

    document.getElementById('mult-score').textContent = multQuizScore.correct;
    document.getElementById('mult-total').textContent = multQuizScore.total;
}

function handleMultQuizEnter(event) {
    if (event.key === 'Enter') {
        checkMultQuiz();
    }
}

// ==========================================
// Division Functions
// ==========================================
function updateDivVisual() {
    const total = parseInt(document.getElementById('div-total').value) || 1;
    const groups = parseInt(document.getElementById('div-groups').value) || 1;
    const result = Math.floor(total / groups);
    const remainder = total % groups;

    document.getElementById('div-result').textContent =
        remainder > 0 ? `${result} R${remainder}` : result;

    // Update story
    const items = ['cookies', 'stars', 'candies', 'stickers', 'balls'];
    const item = items[Math.floor(Math.random() * items.length)];
    document.getElementById('div-story').innerHTML =
        `If you have <strong>${total} ${item}</strong> and want to share them equally among <strong>${groups} friends</strong>, how many does each friend get?`;

    // Create visual groups
    const visualArea = document.getElementById('div-visual-area');
    visualArea.innerHTML = '';

    const colors = ['#6c5ce7', '#00b894', '#fdcb6e', '#e17055', '#74b9ff', '#fd79a8'];

    for (let i = 0; i < groups; i++) {
        const group = document.createElement('div');
        group.className = 'div-group';
        group.style.background = `linear-gradient(135deg, ${colors[i % colors.length]}88 0%, ${colors[(i + 1) % colors.length]}88 100%)`;

        const label = document.createElement('div');
        label.className = 'div-group-label';
        label.textContent = `Friend ${i + 1}`;
        group.appendChild(label);

        const itemsDiv = document.createElement('div');
        itemsDiv.className = 'div-items';

        for (let j = 0; j < result; j++) {
            const itemEl = document.createElement('div');
            itemEl.className = 'div-item';
            itemEl.style.animationDelay = ((i * result + j) * 0.05) + 's';
            itemsDiv.appendChild(itemEl);
        }

        group.appendChild(itemsDiv);
        visualArea.appendChild(group);
    }

    // Show remainder if any
    if (remainder > 0) {
        const remGroup = document.createElement('div');
        remGroup.className = 'div-group';
        remGroup.style.background = 'linear-gradient(135deg, #dfe6e9 0%, #b2bec3 100%)';

        const label = document.createElement('div');
        label.className = 'div-group-label';
        label.textContent = 'Left over';
        remGroup.appendChild(label);

        const itemsDiv = document.createElement('div');
        itemsDiv.className = 'div-items';

        for (let j = 0; j < remainder; j++) {
            const itemEl = document.createElement('div');
            itemEl.className = 'div-item';
            itemsDiv.appendChild(itemEl);
        }

        remGroup.appendChild(itemsDiv);
        visualArea.appendChild(remGroup);
    }
}

function newDivQuiz() {
    // Generate clean division (no remainder)
    const b = Math.floor(Math.random() * 11) + 1;
    const answer = Math.floor(Math.random() * 11) + 1;
    const a = b * answer;

    currentDivQuiz = { a, b, answer };

    document.getElementById('div-quiz-a').textContent = a;
    document.getElementById('div-quiz-b').textContent = b;
    document.getElementById('div-quiz-answer').value = '';
    document.getElementById('div-feedback').innerHTML = '';
    document.getElementById('div-feedback').className = 'feedback';

    document.getElementById('div-quiz-answer').focus();
}

function checkDivQuiz() {
    const userAnswer = parseInt(document.getElementById('div-quiz-answer').value);
    const feedback = document.getElementById('div-feedback');
    const isCorrect = userAnswer === currentDivQuiz.answer;

    divQuizScore.total++;

    if (isCorrect) {
        divQuizScore.correct++;
        feedback.textContent = '🎉 Correct! You\'re a division star!';
        feedback.className = 'feedback success';
        celebrate();
    } else {
        feedback.textContent = `Not quite! ${currentDivQuiz.a} ÷ ${currentDivQuiz.b} = ${currentDivQuiz.answer}`;
        feedback.className = 'feedback error';
    }

    // Update session state
    if (sessionState) {
        const current = sessionState.division || {};
        updateModuleProgress('division', {
            questionsAttempted: (current.questionsAttempted || 0) + 1,
            questionsCorrect: (current.questionsCorrect || 0) + (isCorrect ? 1 : 0)
        });
    }

    document.getElementById('div-score').textContent = divQuizScore.correct;
    document.getElementById('div-total-score').textContent = divQuizScore.total;
}

function handleDivQuizEnter(event) {
    if (event.key === 'Enter') {
        checkDivQuiz();
    }
}

// ==========================================
// Practice Area Functions
// ==========================================
async function startPractice() {
    const type = document.getElementById('practice-type').value;
    const difficulty = document.getElementById('practice-difficulty').value;
    const count = parseInt(document.getElementById('practice-count').value);

    practiceType = type;

    // Generate problems
    if (type === 'mixed') {
        const types = ['addition', 'subtraction', 'multiplication', 'division'];
        practiceProblems = [];
        for (let i = 0; i < count; i++) {
            const randomType = types[Math.floor(Math.random() * types.length)];
            practiceProblems.push(generateProblem(randomType, difficulty));
        }
    } else {
        practiceProblems = [];
        for (let i = 0; i < count; i++) {
            practiceProblems.push(generateProblem(type, difficulty));
        }
    }

    currentPracticeIndex = 0;
    practiceScore = 0;

    // Show practice area
    document.querySelector('.practice-setup').style.display = 'none';
    document.getElementById('practice-area').style.display = 'block';
    document.getElementById('practice-results').style.display = 'none';

    showPracticeProblem();
}

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
                answer: num1 + num2
            };
        case 'subtraction':
            const larger = Math.max(num1, num2);
            const smaller = Math.min(num1, num2);
            return {
                num1: larger,
                num2: smaller,
                operator: '-',
                answer: larger - smaller
            };
        case 'multiplication':
            const mult1 = Math.floor(Math.random() * 12) + 1;
            const mult2 = Math.floor(Math.random() * 12) + 1;
            return {
                num1: mult1,
                num2: mult2,
                operator: '×',
                answer: mult1 * mult2
            };
        case 'division':
            const divisor = Math.floor(Math.random() * 11) + 1;
            const quotient = Math.floor(Math.random() * 11) + 1;
            const dividend = divisor * quotient;
            return {
                num1: dividend,
                num2: divisor,
                operator: '÷',
                answer: quotient
            };
        default:
            return generateProblem('addition', difficulty);
    }
}

function showPracticeProblem() {
    const problem = practiceProblems[currentPracticeIndex];

    document.getElementById('practice-num1').textContent = problem.num1;
    document.getElementById('practice-op').textContent = problem.operator;
    document.getElementById('practice-num2').textContent = problem.num2;
    document.getElementById('practice-answer').value = '';
    document.getElementById('practice-feedback').innerHTML = '';
    document.getElementById('practice-feedback').className = 'feedback';

    // Update progress
    const progress = ((currentPracticeIndex) / practiceProblems.length) * 100;
    document.getElementById('practice-progress').style.width = progress + '%';
    document.getElementById('practice-progress-text').textContent =
        `${currentPracticeIndex + 1} / ${practiceProblems.length}`;

    document.getElementById('practice-answer').focus();
}

function checkPracticeAnswer() {
    const userAnswer = parseInt(document.getElementById('practice-answer').value);
    const problem = practiceProblems[currentPracticeIndex];
    const feedback = document.getElementById('practice-feedback');

    if (isNaN(userAnswer)) {
        feedback.textContent = 'Please enter a number!';
        feedback.className = 'feedback error';
        return;
    }

    if (userAnswer === problem.answer) {
        practiceScore++;
        feedback.textContent = '🎉 Correct!';
        feedback.className = 'feedback success';
        celebrate();
    } else {
        feedback.textContent = `The answer was ${problem.answer}. Keep trying!`;
        feedback.className = 'feedback error';
    }

    setTimeout(() => {
        currentPracticeIndex++;
        if (currentPracticeIndex < practiceProblems.length) {
            showPracticeProblem();
        } else {
            showPracticeResults();
        }
    }, 1500);
}

function skipProblem() {
    currentPracticeIndex++;
    if (currentPracticeIndex < practiceProblems.length) {
        showPracticeProblem();
    } else {
        showPracticeResults();
    }
}

function handlePracticeEnter(event) {
    if (event.key === 'Enter') {
        checkPracticeAnswer();
    }
}

async function showPracticeResults() {
    document.getElementById('practice-area').style.display = 'none';
    document.getElementById('practice-results').style.display = 'block';

    const total = practiceProblems.length;
    const percent = Math.round((practiceScore / total) * 100);

    document.getElementById('results-correct').textContent = practiceScore;
    document.getElementById('results-total').textContent = total;
    document.getElementById('results-percent').textContent = percent + '%';

    // Record practice session and get stars earned
    const starsEarned = await recordPracticeSession(practiceScore, total, practiceType);

    // Show stars based on score
    const starsContainer = document.getElementById('stars-earned');
    let starsHtml = '';
    const starCount = Math.ceil((percent / 100) * 5);

    for (let i = 0; i < 5; i++) {
        if (i < starCount) {
            starsHtml += '⭐';
        } else {
            starsHtml += '☆';
        }
    }
    starsContainer.innerHTML = starsHtml;

    // Show total stars earned message
    if (starsEarned > 0) {
        starsContainer.innerHTML += `<p style="font-size: 1rem; margin-top: 0.5rem;">+${starsEarned} stars earned!</p>`;
    }

    // Update progress bar to 100%
    document.getElementById('practice-progress').style.width = '100%';

    if (percent >= 80) {
        celebrate();
    }
}

function resetPractice() {
    document.querySelector('.practice-setup').style.display = 'flex';
    document.getElementById('practice-area').style.display = 'none';
    document.getElementById('practice-results').style.display = 'none';
    document.getElementById('practice-progress').style.width = '0%';
}

// ==========================================
// Celebration Effect
// ==========================================
function celebrate() {
    const celebration = document.getElementById('celebration');
    celebration.style.display = 'block';
    celebration.innerHTML = '';

    const colors = ['#6c5ce7', '#00b894', '#fdcb6e', '#e17055', '#74b9ff', '#fd79a8', '#ffeaa7'];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = (Math.random() * 0.5) + 's';
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

        // Random shapes
        if (Math.random() > 0.5) {
            confetti.style.borderRadius = '50%';
        }

        celebration.appendChild(confetti);
    }

    setTimeout(() => {
        celebration.style.display = 'none';
    }, 3000);
}

// ==========================================
// Utility Functions
// ==========================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
