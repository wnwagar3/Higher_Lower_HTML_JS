



/**
 * describe guessing game, 
 * take higherLimit (number) > 1
 * pickSecretNumber between 1 and higerLimit
 * user inputs (number) a guess, savePastGuesses
 * return "higher","lower","correct" + attempts and answers
 */

// jsdoc comments
/**
 * aske the user for an input 
 * @param {string} promptMsg message shown to user when asking for input
 * @param {Function} throwErrorIfInputInvalidFn callback that will be used to evaluate the input and throw error if it fails
 * @param {(any)=> number} obtainInputFn callback which is called to obtain input, contains logic to retrieve input
 * @param {boolean} repeatOnErrors boolean determins if input operation should be repeated if input is invalid
 * @param {(string)=>void} outputInformationFn used to output information to the user
 * @returns {number}
 */
function askUserForInput(/** @type string */ promptMsg, throwErrorIfInputInvalidFn, obtainInputFn, repeatOnErrors = true, outputInformationFn) {

    try {
        let result =/**@type number */ parseInt(Math.round(obtainInputFn(promptMsg)));
        throwErrorIfInputInvalidFn(result)
        return result
    } catch (/**@type Error */ error) {
        outputInformationFn(error.message);

        if (repeatOnErrors == false) {
            return;
        }

        return /**@type number */ askUserForInput(promptMsg, throwErrorIfInputInvalidFn, obtainInputFn, repeatOnErrors, outputInformationFn)
    }
}

function showGuesses(/** @type [] */ _pastGuesses) {
    document.querySelector('ol#past-guesses-list').innerHTML = _pastGuesses.map((a_guess) => `<li>${a_guess}</li>`).join('')
}

function checkGuessAndUpdateArray(userGuess, secretRandomGuess,/** @type [] */ pastGuesses) {
    let result = false;

    if (Number.isFinite(userGuess) == false) {
        return result
    }

    if (pastGuesses.includes(userGuess)) {
        showMessageOnScreen(`You have guessed ${userGuess} already, Try submitting another guess..`)
        return result;//return and do not count the duplicate
    } else if (userGuess <= 0 || userGuess > higherLimit) {
        //out of bounds
        showMessageOnScreen("That number is not in range, try again.")
        return result;
    } else if (userGuess === secretRandomGuess) {
        result = true;
    } else if (userGuess > secretRandomGuess) {
        showMessageOnScreen("Guess is too high");
    } else if (userGuess < secretRandomGuess) {
        showMessageOnScreen("Guess is too low");
    }

    pastGuesses.push(userGuess)

    return result

}

function userGuessErrorCheckFn(guess) {

    if (guess < 1) {
        throw new Error("That number is not in range, try again.")
    }

    if (Number.isFinite(guess) == false) {
        throw new Error("Error: Input not a valid number.");
    }
}

function higherLimitErrorCheckFn(higherLimit) {
    if ((higherLimit > 1) == false) {
        throw new Error("Error: Input must be a positive integer greater than 1.")
    }

    if (Number.isFinite(higherLimit) == false) {
        throw new Error("Error: Input must be a valid integer.");
    }
}



function showMessageOnScreen(/**@type string */msg) {
    document.querySelector('p#message').textContent = msg
}

function getUserGuessFromInputField() {

    return Number(document.querySelector('#guess[type=text]').value)
}

function checkGuessClickHandler(event) {
    event.preventDefault()// stops form/page from reloading
    const button = document.querySelector("button")

    button.setAttribute('disabled', true);
    let guessFromUser = askUserForInput(`Guess a number between 1 and ${higherLimit}`, userGuessErrorCheckFn, getUserGuessFromInputField, false, showMessageOnScreen)
    const wonGame = checkGuessAndUpdateArray(guessFromUser, secretRandomGuess, pastGuesses)
    // console.table({wonGame, secretRandomGuess,guessFromUser})

    // showGuesses(pastGuesses)
    if (wonGame == true) {
        const winMsg = (`You got it! It took you ${pastGuesses.length} tries and your guesses were ${pastGuesses.join(', ')}.`);
        showMessageOnScreen(winMsg)
    }

    //enable button after 1.5s
    setTimeout(() => {
        button.removeAttribute('disabled');
    }, 1_500)
}

// when page opens/loads, ask for higherlimit with prompt and show errors with alert
let pastGuesses = []//create array to hold past guesses
const higherLimit = askUserForInput("Please enter a number greater 1", higherLimitErrorCheckFn, prompt, true, alert)//take the higherlimit
document.querySelector('span#higherLimit').textContent = higherLimit
const secretRandomGuess = parseInt(Math.round(Math.random() * higherLimit + 1))


