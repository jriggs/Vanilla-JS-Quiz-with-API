let currentQuestionIndex = 0;
let currentQuestion = {};

document.addEventListener('DOMContentLoaded', 
    () =>{

        const pAnswers = document.querySelectorAll('p');
        pAnswers.forEach(
            (element) =>{
                element.addEventListener('click',
                    (e) =>{
                        e.target.classList.add('selected');
                        console.log(e.target.innerText);
                        if (e.target.innerText == currentQuestion.correct_answer ){
                            console.log('yo');
                        }
                    }
                )
            }
        );

        //async js call that chains callbacks
        //when server responds
        fetch('https://opentdb.com/api.php?amount=1')
        .then(response => response.json())
        //pass data to our quiz function
        //data is an array of question objects
        .then(data => displayQuestion(data.results));
    }
)

function displayQuestion(questions){

    currentQuestion = questions[currentQuestionIndex];
    console.log(currentQuestion);
    const question = document.getElementById('questionText');
    question.innerHTML =  currentQuestion.question;
//TODO fix insecure innerHTML
//innerHTML is bad because we will directly inject any data
//recd from apu
    const answers = currentQuestion.incorrect_answers;
    //TODO randomize splice
    answers.push(currentQuestion.correct_answer);

    //querySelectAll is an 'array' of matchin elements
    const pAnswers = document.querySelectorAll('p');

    pAnswers.forEach(
        //forEach optionally passes the current index
        (paragraph, index) =>{
            
            paragraph.innerHTML = answers[index];
        }
    )

}