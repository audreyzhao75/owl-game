// Fetch owl data
let owlData = [];
fetch('./owl.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        owlData = data;
    })
    .catch(error => {
        console.error('Error fetching JSON:', error);
});

// Stats
let hearts = 3;
let score = 0;
let gamePlaying = false;
let correctAnswer = null;

const scoreEle = document.getElementById("score");
const heartsEle = document.getElementById("hearts");

// Screens
const instructionScreen = document.getElementById("instructions");
const gameScreen = document.getElementById("gameplay");
const gameOverScreen = document.getElementById("gameover");

// Buttons
const allStartGameButtons = document.querySelectorAll(".start-game-btn");
// allRestartGameButtons = document.querySelectorAll(".restart-game-btn");

// Fields
const owlImage = document.getElementById("owl-image");
const nameField = document.getElementById("nameField");
const genderField = document.getElementById("genderField");
const speciesField = document.getElementById("speciesField");
const sciNameField = document.getElementById("sciNameField");
const fieldQuestion = document.getElementById("question");

const option1 = document.getElementById("option1");
const option2 = document.getElementById("option2");



allStartGameButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        hearts = 3;
        score = 0;
        gamePlaying = true;
        setStats();

        instructionScreen.style.display = "none";
        gameScreen.style.display = "block";
        gameOverScreen.style.display = "none";

        // load the first stage of the main game
        loadLevel();
    })
});

function setStats() {
    scoreEle.textContent = score;
    heartsEle.textContent = hearts;
}

function loadLevel() {
    const randOwl = owlData[Math.floor(Math.random() * owlData.length)];

    const fieldsTested = ["species", "scientificName"];
    let randfield = Math.floor(Math.random() * fieldsTested.length);

    nameField.textContent = randOwl["name"];
    genderField.textContent = randOwl["gender"];
    owlImage.src = "media/movie/"+randOwl["charPic"];
    // media/movie/soren.png

    let options = [];
    let optionInd = null;

    if(randfield == 0) {  // species missing
        sciNameField.textContent = randOwl["scientificName"];
        speciesField.textContent = "?";
        correctAnswer = randOwl["species"];
        fieldQuestion.textContent = "species";
        options = owlData.filter(item => item.species != correctAnswer).map(item => item.species);
        optionInd = Math.floor(Math.random() * options.length);
    }
    else {
        sciNameField.textContent = "?";
        speciesField.textContent = randOwl["species"];
        correctAnswer = randOwl["scientificName"];
        fieldQuestion.textContent = "scientific name";
        options = owlData.filter(item => item.scientificName != correctAnswer).map(item => item.scientificName);
    }
    // options
    randfield = Math.floor(Math.random() * 2);
    optionInd = Math.floor(Math.random() * options.length);

    if (options.length != 0) {
        option1.textContent = randfield == 0 ? correctAnswer : options[optionInd];
        option2.textContent = randfield == 0 ?  options[optionInd] : correctAnswer;
    }
}

function verifyAnswer(e) {
    // highlight the right one
    if(correctAnswer !== e.target.textContent) {
        if(e.target === option1) {
            option1.classList.add("wrong-answer");
        }
        else {
            option2.classList.add("wrong-answer");
        }
        hearts--;
        document.getElementById("wrongSound").play();
    }
    else {
        score++;
        document.getElementById("correctSound").play();
    }
    setStats();

    if(option1.textContent === correctAnswer) {
        option1.classList.add("correct-answer");
    }
    else {
        option2.classList.add("correct-answer");
    }

    window.setTimeout(nextLevel, 1000);
}

function gameover() {
    gamePlaying = false;

    document.getElementById("final-score").textContent = score;
    gameScreen.style.display = "none";
    gameOverScreen.style.display = "block";
}

function nextLevel() {
    option1.classList.remove("correct-answer");
    option2.classList.remove("correct-answer");
    option1.classList.remove("wrong-answer");
    option2.classList.remove("wrong-answer");

    if(hearts > 0) {
        loadLevel();
    }
    else {
        gameover();
    }
}

option1.addEventListener("click", verifyAnswer);
option2.addEventListener("click", verifyAnswer);