// Setting game name
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector("footer").innerHTML = `${gameName} Created by Mohammad`;

// Setting game options
let numberOfTries = 6;
let numberOfLetters = 6;
let currentTry = 1;
let numberOfHints = 2;

// Manage words
let wordToGuess = "";
let wordsList = [
  "Create",
  "Update",
  "Delete",
  "Master",
  "Branch",
  "Mainly",
  "Elzero",
  "School",
];
wordToGuess =
  wordsList[Math.floor(Math.random() * wordsList.length)].toLowerCase();
let messageArea = document.querySelector(".message");

// Manage hints
document.querySelector(".hint span").innerHTML = numberOfHints;
const getHintButton = document.querySelector(".hint");
getHintButton.addEventListener("click", getHint);

function GenerateInputs() {
  const inputContainer = document.querySelector(".inputs");

  // Create main div
  for (let i = 1; i <= numberOfTries; i++) {
    const tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    tryDiv.innerHTML = `<span>Try ${i}</span>`;

    if (i !== 1) tryDiv.classList.add("disabled-inputs");

    // Create inputs
    for (let j = 1; j <= numberOfLetters; j++) {
      const input = document.createElement("input");
      input.type = "text";
      input.id = `guess-${i}-letter-${j}`;
      input.maxLength = 1;
      input.setAttribute("autocomplete", "off");
      input.setAttribute("autocorrect", "off");
      input.setAttribute("autocapitalize", "off");
      input.setAttribute("spellcheck", "false");
      tryDiv.appendChild(input);
    }

    inputContainer.appendChild(tryDiv);
  }

  // Focus on the first input
  inputContainer.children[0].children[1].focus();

  // Disable all inputs except the first try
  const inputsInDisabledDivs = document.querySelectorAll(
    ".disabled-inputs input",
  );
  inputsInDisabledDivs.forEach((input) => (input.disabled = true));

  const inputs = document.querySelectorAll("input");
  inputs.forEach((input, index) => {
    // Convert inputs to uppercase
    input.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
      const nextInput = inputs[index + 1];
      if (nextInput) nextInput.focus();
    });
  });
}

const checkButton = document.querySelector(".check");
checkButton.addEventListener("click", handleGuesses);

function handleGuesses() {
  let successGuess = true;
  for (let i = 1; i <= numberOfLetters; i++) {
    const inputField = document.querySelector(
      `#guess-${currentTry}-letter-${i}`,
    );
    const letter = inputField.value.toLowerCase();
    const actualLetter = wordToGuess[i - 1];

    // Game logic
    if (letter === actualLetter) {
      // Letter is correct and in the correct place
      inputField.classList.add("yes-in-place");
    } else if (wordToGuess.includes(letter) && letter !== "") {
      // Letter is correct but not in place
      inputField.classList.add("not-in-place");
      successGuess = false;
    } else {
      // Letter is wrong
      inputField.classList.add("no");
      successGuess = false;
    }
  }

  // Check if user win or lose
  if (successGuess) {
    if (numberOfHints === 2) {
      messageArea.innerHTML = `
      You win the word is <span>${wordToGuess}</span>
      <p>Congrats you  didn't use hints</p>
      `;
    } else {
      messageArea.innerHTML = `You win the word is <span>${wordToGuess}</span>`;
    }

    // Disable all inputs
    let allTries = document.querySelectorAll(".inputs > div");
    allTries.forEach((tryDiv) => tryDiv.classList.add("disabled-inputs"));

    // Disable guess button
    checkButton.disabled = true;
    getHintButton.disabled = true;
    scheduleRestart();
  } else {
    document
      .querySelector(`.try-${currentTry}`)
      .classList.add("disabled-inputs");

    const currentTryInputs = document.querySelectorAll(
      `.try-${currentTry} input`,
    );
    currentTryInputs.forEach((input) => (input.disabled = true));

    currentTry++;

    const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
    nextTryInputs.forEach((input) => (input.disabled = false));

    let el = document.querySelector(`.try-${currentTry}`);
    if (el) {
      document
        .querySelector(`.try-${currentTry}`)
        .classList.remove("disabled-inputs");
      el.children[1].focus();
    } else {
      // Disable guess button
      checkButton.disabled = true;
      getHintButton.disabled = true;
      messageArea.innerHTML = `You lose the word is <span>${wordToGuess}</span>`;
      scheduleRestart();
    }
  }
}

function scheduleRestart() {
  let seconds = 3;
  const originalHTML = messageArea.innerHTML;
  messageArea.innerHTML += `<p class="restart-countdown">New game in ${seconds}...</p>`;

  const countdown = setInterval(() => {
    seconds--;
    const countdownEl = messageArea.querySelector(".restart-countdown");
    if (seconds > 0) {
      countdownEl.textContent = `New game in ${seconds}...`;
    } else {
      clearInterval(countdown);
      restartGame();
    }
  }, 1000);
}

function restartGame() {
  currentTry = 1;
  numberOfHints = 2;
  wordToGuess =
    wordsList[Math.floor(Math.random() * wordsList.length)].toLowerCase();

  messageArea.innerHTML = "";
  document.querySelector(".hint span").innerHTML = numberOfHints;
  getHintButton.disabled = false;
  checkButton.disabled = false;

  document.querySelector(".inputs").innerHTML = "";
  GenerateInputs();
}

function getHint() {
  if (numberOfHints > 0) {
    numberOfHints--;
    document.querySelector(".hint span").innerHTML = numberOfHints;
  }
  if (numberOfHints === 0) {
    getHintButton.disabled = true;
  }

  const enabledInputs = document.querySelectorAll("input:not([disabled])");
  const emptyeEnabledInputs = Array.from(enabledInputs).filter(
    (input) => input.value === "",
  );

  if (emptyeEnabledInputs.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyeEnabledInputs.length);
    const randomInput = emptyeEnabledInputs[randomIndex];
    const indexToFill = Array.from(enabledInputs).indexOf(randomInput);
    if (indexToFill !== -1) {
      randomInput.value = wordToGuess[indexToFill].toUpperCase();
    }
  }
}

function handleBackspace(event) {
  const inputs = document.querySelectorAll("input:not([disabled])");
  const currentIndex = Array.from(inputs).indexOf(document.activeElement);

  if (event.key === "Backspace") {
    if (currentIndex > 0) {
      const currentInput = inputs[currentIndex];
      const prevInput = inputs[currentIndex - 1];
      currentInput.value = "";
      prevInput.value = "";
      prevInput.focus();
    }
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    if (currentIndex > 0) inputs[currentIndex - 1].focus();
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    if (currentIndex < inputs.length - 1) inputs[currentIndex + 1].focus();
  } else if (event.key === "Enter") {
    if (!checkButton.disabled) handleGuesses();
  }
}

document.addEventListener("keydown", handleBackspace);

window.onload = function () {
  GenerateInputs();
};
