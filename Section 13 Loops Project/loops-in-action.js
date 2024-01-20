// section 1

// selecting the calculator section :-
const calculatorSection = document.getElementById("calculator");

// selecting the input box where we will get the number input :-
const inputNumber = calculatorSection.querySelector("input").textContent;

// selecting the hidden element :-
const calculatedSum = calculatorSection.querySelector("#calculated-sum");

// selecting the calculate sum button :-
const calculateSumButton = calculatorSection.querySelector("button");

// writing a function to add sum of number:-
function addSum(event) {
  const num = calculatorSection.querySelector("input").value;
  // console.log(num);
  let sum = 0;
  for (let i = 0; i <= num; i++) {
    sum = sum + i;
  }
  calculatedSum.style.display = "block";
  //   calculatedSum.style.remove.display;
  calculatedSum.textContent = sum;
  console.log(sum);
}

// adding an user event on calculatesumbutton :-
calculateSumButton.addEventListener("click", addSum);

// section 2

// selecting the highlight section & button :-
const highlightSection = document.getElementById("highlight-links");
const highlightLinksButton = highlightSection.querySelector("button");

// writing a function to make links highlight:-
function makeLinksHighlight(event) {
  // selecting all the links:-
  const links = highlightSection.querySelectorAll("a");

  for (const link of links) {
    link.classList.add("highlight");
  }
}

// adding event listener to the button :-
highlightLinksButton.addEventListener("click", makeLinksHighlight);

// section 3

// const userDataSection = document.getElementById("user-data");
const userDataButton = document.querySelector("#user-data button");

const dummyData = {
  firstName: "Mohit",
  lastName: "Jangid",
  age: 26,
};

function displayUserData() {
  const outputDataElement = document.getElementById("output-user-data");
  outputDataElement.innerHTML = "";

  for (const key in dummyData) {
    const newUserDataListItemElement = document.createElement("li");
    const ouputText = key.toUpperCase() + ": " + dummyData[key];
    newUserDataListItemElement.textContent = ouputText;
    outputDataElement.append(newUserDataListItemElement);
  }
}

userDataButton.addEventListener("click", displayUserData);

// section 4

const rollDiceButtonElement = document.querySelector("#statistics button");

// this will work as a dice which will generate a random number
function rollDice() {
    let randomNumber = Math.ceil( Math.random() * 6);
  console.log(randomNumber);
  return randomNumber;
}

function deriveNumberOfDiceRolls() {
  const targetNumberInputElement =
    document.getElementById("user-target-number");
  const diceRollsListElement = document.getElementById("dice-rolls");
  const enteredNumber = targetNumberInputElement.value;
  diceRollsListElement.innerHTML = "";

  let numberOfRolls = 0;
  let hasRolledTargetNumber = false;

  while (!hasRolledTargetNumber) {
    const rolledNumber = rollDice();
    hasRolledTargetNumber = rolledNumber == enteredNumber;
    numberOfRolls += 1;
    const newRollListItem = document.createElement("li");
    newRollListItem.textContent = 'Roll '+ numberOfRolls +": " + rolledNumber;
    diceRollsListElement.append(newRollListItem);
  }
  const xElement = document.getElementById("output-total-rolls");
  const yElement = document.getElementById("output-target-number");
  xElement.textContent = numberOfRolls;
  yElement.textContent = enteredNumber;
}

rollDiceButtonElement.addEventListener("click", deriveNumberOfDiceRolls);
