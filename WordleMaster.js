/* TASKLIST
1. store word of the day as solution word in a variable --> 
2. Enable divs to take user input:
    a) users should only be allowed to enter 5 letters at once
    b) users should be able to delete 1 or several of entered letters (up to 5) --> current row
    c) block additional user input once 5 letters entered
        i) if users would like to change characters they should use delete function (see b))
    d) users need to press enter to confirm their input
        i) only then input will get checked
            I)    green:  user input char === solution word char
            II)   yellow: user input char is contained in solution word but wrong spot
            III)  grey:   user input char != contained in solution word
    e)  if users don't match solution word in all five spots, 
        needs to be advance to next row (see .html classes row-one to row-six)
    f) if users matches all five letters --> they win
        i)  see d)i)I) --> all letters green
        ii) fun animations to be added 
    g) if neither of the six rows matches solution words --> users loose 

*/
//retrieving solution word from API


//selecting all letters so they can be modified
const letters = document.querySelectorAll('.box');
//creating panda variable to be able to modify panda emoji later
const panda = document.querySelector('.loading-bar');
//length for answer
const ANSWER_LENGTH = 5;
const ROUNDS = 6;


/* PROGRAM START */

async function init() {
    //initial variables for the program
    let currentGuess = '';
    let currentRow = 0;
    let done = false;
    let isLoading = true;

    //retrieving solution word from API
    const res = await fetch("https://words.dev-apis.com/word-of-the-day");
    const resObject = await res.json();
    const solutionWord = resObject.word.toUpperCase();
    const solutionWordParts = solutionWord.split("");
    isLoading = false;
    setPanda(false);

    document.addEventListener('keydown', function handleKeyStroke(event) {
        if (done || isLoading) {
            // do nothing;
            return;
        }

        const action = event.key;

        if (action === 'Enter') {
            commitGuess();
        } else if (action === 'Backspace') {
            backspace();
        } else if (isLetter(action)) {
            input(action);
        } else {
            //do nothing
        }
    });

    function input(letter) {
        if (currentGuess.length < ANSWER_LENGTH) {
            currentGuess += letter.toUpperCase();
        } else {
            currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter.toUpperCase();
        }

        letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText = letter.toUpperCase();
    }

    function backspace() {
        currentGuess = currentGuess.substring(0, currentGuess.length - 1);
        letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = '';
    }

    async function commitGuess() {
        if (currentGuess.length !== ANSWER_LENGTH) {
            //do nothing
            return;
        }

        // check the API to see if it's a valid word
        // skip this step if you're not checking for valid words
        isLoading = true;
        //setLoading(isLoading);
        const res = await fetch("https://words.dev-apis.com/validate-word", {
            method: "POST",
            body: JSON.stringify({ word: currentGuess }),
        });
        const { validWord } = await res.json();
        isLoading = false;
        //setLoading(isLoading);

        // not valid, mark the word as invalid and return
        if (!validWord) {
            markInvalidWord();
            return;
        }


        // TODO is input correct, close or wrong?
        const guessParts = currentGuess.split("");
        const map = makeMap(solutionWordParts);
        let allRight = true;

        for (let i = 0; i < ANSWER_LENGTH; i++) {
            let currentLetterBox = letters[currentRow * ANSWER_LENGTH + i];
            let currentLetter = guessParts[i];

            if (currentLetter == solutionWordParts[i]) {
                // this letter is correct
                currentLetterBox.classList.add("correct");
                map[currentLetter]--;
            }
        }

        for (let i = 0; i < ANSWER_LENGTH; i++) {
            let currentLetterBox = letters[currentRow * ANSWER_LENGTH + i];
            let currentLetter = guessParts[i];

            if (currentLetter == solutionWordParts[i]) {
                // this letter is correct
                continue;
            }

            allRight = false;
            if (solutionWordParts.includes(currentLetter) && map[currentLetter] > 0) {
                // this means that the letter is in the word but not in the correct place and for sure not yet discovered
                currentLetterBox.classList.add("close");
                continue;
            }

            if (!solutionWordParts.includes(currentLetter)) {
                currentLetterBox.classList.add("wrong");
            }
        }

        // TODO did they win or loose?
        currentRow++;
        currentGuess = '';
        if (allRight) {
            // win
            alert("you win");
            document.querySelector(".brand").classList.add("winner");
            done = true;
        } else if (currentRow === ROUNDS) {
            // lose
            alert(`you lose, the word was ${solutionWord}`);
            done = true;
        }

    }

    function markInvalidWord() {
        for (let i = 0; i < ANSWER_LENGTH; i++) {
            letters[currentRow * ANSWER_LENGTH + i].classList.remove("invalid");

            // long enough for the browser to repaint without the "invalid class" so we can then add it again
            setTimeout(
                () => letters[currentRow * ANSWER_LENGTH + i].classList.add("invalid"),
                10
            );
        }
    }
}

/* HELPER METHODS */
//function checking if user input is letter
function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

//show panda when not loading
function setPanda(isLoading) {
    panda.classList.toggle("show", !isLoading);
}

function makeMap(array) {
    const obj = {};
    for (let i = 0; i < array.length; i++) {
        if (obj[array[i]]) {
            obj[array[i]]++;
        } else {
            obj[array[i]] = 1;
        }
    }
    return obj;
}

init();
