//global variables for our quiz app. only add as necessary
const API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple';
let currentQuestionIndex = 0;
let allQuestions = [
    {
        correct_answer: '',
        incorrect_answers: []
    }
];
let numCorrect = 0;

//elements we care about
let questionParagraphs, questionText, answerButton, nextButton, score;

document.addEventListener('DOMContentLoaded', 
    () =>{
        //once DOM is loaded we can start with js things
        getElementReferences();
        setupEventListeners();
        //async js call that chains callbacks
        //when server responds
        fetch(API_URL)
        .then(response => response.json())
        //pass data to our quiz function
        //data is an array of question objects
        .then(data => 
            {
                allQuestions = data.results;
                updateScore();
                displayQuestion();
            }
        );
    }
)

function displayQuestion(){

    let currentQuestion = allQuestions[currentQuestionIndex];

    questionText.innerHTML = `Question ${currentQuestionIndex + 1}: ${currentQuestion.question}`;
    //TODO fix insecure innerHTML
    //innerHTML is bad because we will directly inject any data recd from api
    const answers = currentQuestion.incorrect_answers;
    answers.push(currentQuestion.correct_answer);

    //shuffle the answers
    answers.sort(() => Math.random() - 0.5);

    //questionParagraphs declared as global because we use it a lot in the code
    //it is an 'array' of matching elements
    questionParagraphs.forEach(
        //forEach optionally passes the current index
        //lets use that too reference our answers array element
        (paragraph, index) =>{
            paragraph.classList = '';
            paragraph.innerHTML = answers[index];
        }
    )
    //button cannot be clicked when disabled
    answerButton.disabled = true;
}

function selectAnswer(clickedElement){
        //cannot change answer after you picked one, sorry!
        if(answerButton.style.display === 'none'){return;}
        //remove any classes from the answer paragraphs before setting selected
        questionParagraphs.forEach(qp => qp.classList = '');
        //adding a class to indicate users choice
        clickedElement.target.classList.add('selected');

        answerButton.disabled = false;
}

function checkAnswer(){
    questionParagraphs.forEach(
        (element) => {
            //setup some variables to make logic expression easier to read
            const isUserAnswer = element.classList.contains('selected');
            const correctAnswer =  allQuestions[currentQuestionIndex].correct_answer;

            if(isUserAnswer && element.innerText !== correctAnswer){
                element.classList.add('wrong');
            } else if(element.innerText === correctAnswer){
                element.classList.add('correct');
               if(isUserAnswer){
                numCorrect++;
               }
            } 
        }
    );

    updateScore();
    answerButton.style.display = 'none';
    nextButton.style.display = 'block';
}
//made this a function b/c its used more than once
function updateScore(){
    score.innerText = `${numCorrect}/${allQuestions.length}`;
}

function nextQuestion(){
    currentQuestionIndex++;
    if(allQuestions.length > currentQuestionIndex){
        displayQuestion();
        answerButton.style.display = 'block';
        nextButton.style.display = 'none';
    } else {
        answerButton.style.display = 'none';
        nextButton.style.display = 'none';
        alert('Game over, man!');
    }
}

function setupEventListeners(){ 
    questionParagraphs.forEach(
        (element) =>{
            element.addEventListener('click', selectAnswer);
        }
    );

    answerButton.addEventListener('click', checkAnswer);
    nextButton.addEventListener('click', nextQuestion);
}

function getElementReferences(){
    questionParagraphs = document.querySelectorAll('p');
    questionText = document.getElementById('questionText');
    answerButton = document.getElementById('checkAnswer');
    nextButton = document.getElementById('nextQuestion');
    score = document.getElementById('score');
}