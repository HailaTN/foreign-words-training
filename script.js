const flipCard = document.querySelector('.flip-card');
const cardFront = document.getElementById('card-front');
const cardBack = document.getElementById('card-back');
const backButton = document.getElementById('back');
const nextButton = document.getElementById('next');
const examButton = document.getElementById('exam');
const currentWord = document.getElementById('current-word');
const totalWord = document.getElementById('total-word');
const examCardsContainer = document.getElementById('exam-cards');
const examMode = document.getElementById('exam-mode');

const words = [
    { word: 'Hello', translation: 'Здравствуйте', example: 'Hello, how are you?' },
    { word: 'Thank you', translation: 'Спасибо', example: 'Thank you very much!' },
    { word: 'Goodbye', translation: 'До свидания', example: 'Goodbye and see you soon!' },
    { word: 'Please', translation: 'Пожалуйста', example: 'Can you help me, please?' },
    { word: 'Yes', translation: 'Да', example: 'Yes, that\'s correct.' }
];

let currentIndex = 0;
let selectedCards = [];
let matchedPairs = 0;

function initialize() {
    totalWord.innerText = words.length;
    updateCard();
}

function updateCard() {
    const word = words[currentIndex];
    cardFront.querySelector('h1').innerText = word.word;
    cardBack.querySelector('h1').innerText = word.translation;
    cardBack.querySelector('span').innerText = word.example;
    currentWord.innerText = currentIndex + 1;

    backButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === words.length - 1;
}

flipCard.addEventListener('click', () => {
    flipCard.classList.toggle('active');
});

nextButton.addEventListener('click', () => {
    if (currentIndex < words.length - 1) {
        currentIndex++;
        updateCard();
        flipCard.classList.remove('active');
    }
});

backButton.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateCard();
        flipCard.classList.remove('active');
    }
});

examButton.addEventListener('click', () => {
    examMode.classList.remove('hidden');
    document.querySelector('.study-cards').classList.add('hidden');
    document.getElementById('study-mode').classList.add('hidden');
    shuffleWords();
    renderExamCards();
});

function shuffleWords() {
    for (let i = words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [words[i], words[j]] = [words[j], words[i]];
    }
}

function renderExamCards() {
    examCardsContainer.innerHTML = '';
    words.forEach(word => {
        const card = document.createElement('div');
        card.className = 'card';
        
        card.innerText = word.word; 
        card.dataset.translation = word.translation; 
        card.addEventListener('click', () => selectCard(card));
        examCardsContainer.appendChild(card);
    });

    words.forEach(word => {
        const card = document.createElement('div');
        card.className = 'card';
        
        card.innerText = word.translation; 
        card.dataset.word = word.word; 
        card.addEventListener('click', () => selectCard(card));
        examCardsContainer.appendChild(card);
    });
}

function selectCard(card) {
    if (selectedCards.length < 2) {
        selectedCards.push(card);
        card.classList.add('selected'); 

        if (selectedCards.length === 1) {
            card.classList.add('correct'); 
        }

        if (selectedCards.length === 2) {
            checkMatch();
        }
    }
}

function checkMatch() {
    const [firstCard, secondCard] = selectedCards;

    if (firstCard.dataset.translation === secondCard.innerText || firstCard.innerText === secondCard.dataset.translation) {
        firstCard.classList.add('fade-out');
        secondCard.classList.add('fade-out');

        setTimeout(() => {
            firstCard.remove();
            secondCard.remove();
            matchedPairs++;

            if (matchedPairs === words.length) {
                alert("Вы успешно завершили проверку знаний!");
                resetGame();
            }
        }, 1000);

    } else {
        secondCard.classList.add('wrong');
        setTimeout(() => {
            firstCard.classList.remove('selected', 'correct'); 
            secondCard.classList.remove('selected', 'wrong');
            selectedCards = [];
        }, 500);
    }

    selectedCards = [];
}

function resetGame() {
    matchedPairs = 0;
    renderExamCards();
}

document.getElementById('exam').addEventListener('click', () => {
    examMode.classList.remove('hidden');
    renderExamCards();
});

const shuffleButton = document.getElementById('shuffle-words');

shuffleButton.addEventListener('click', () => {
    shuffleWords();
    updateCard();
    currentIndex = 0; 
});

function shuffleWords() {
    for (let i = words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [words[i], words[j]] = [words[j], words[i]];
    }
}

document.addEventListener('DOMContentLoaded', initialize);