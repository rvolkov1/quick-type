let currKey = 0;
let words = 0;
let altKey = false;

const letters = document.getElementsByClassName('letter');
letters[currKey].classList.add("currKey");

let currWord = letters[currKey].parentElement;

function updateScroll(element) {
  const textbox_top = element.parentElement.parentElement.getBoundingClientRect().top;
  const element_top = element.parentElement.getBoundingClientRect().top;

  console.log(textbox_top)
  console.log(element_top)
  console.log((element_top - textbox_top)/element.parentElement.clientHeight)

  if ((element_top - textbox_top)/element.parentElement.clientHeight >= 3) {
    console.log('yes')
    const wordsToBeHidden = [];
    for (word of document.getElementsByClassName('word')) {
      if (word.style.display === "none") continue;
      if (word.getBoundingClientRect().top === word.parentElement.getBoundingClientRect().top) {
        wordsToBeHidden.push(word)
      } else {
        break;
      }
    }
    for (word of wordsToBeHidden) {
      word.style.display = "none";
    }
  }
}

function altDelete() {
  if ((letters[currKey-1].parentElement !== letters[currKey].parentElement && letters[currKey].innerHTML === "&nbsp;") || currKey == 0) return;

  letters[currKey].classList.remove("currKey");
  letters[currKey - 1].classList.remove("incorrect", "correct");
  currKey --;
  letters[currKey].classList.add("currKey");

  if (letters[currKey-1].innerHTML === "&nbsp;") return;
  altDelete();
}

function convertCharValues(key) {
  switch (key) {
    case "&nbsp;":
      return " ";
      break;
    case "\'":
    case "\‘":
    case "\’":
      return "\'";
      break;
    case "\"":
    case "\”":
    case "\“":
      return "\"";
      break;
    default:
      return letters[currKey].innerText;
  }
}

window.addEventListener('keydown', (e) => {
  // convert non breaking spaces to " "
  const prevLetterCorrect = currKey > 0 ? !letters[currKey - 1].classList.contains("incorrect") : true;

  if (e.key === "Alt") {
    altKey = true;
  }

  const currChar = convertCharValues(letters[currKey].innerHTML);

  if (e.key === currChar && prevLetterCorrect && e.key.length === 1) {
    letters[currKey].classList.remove("currKey");
    letters[currKey].classList.add("correct");
    currKey ++;
    letters[currKey].classList.add("currKey");
    updateScroll(letters[currKey])
  }  else if (e.key === "Backspace" && currKey > 0 && (letters[currKey-1].parentElement == letters[currKey].parentElement || letters[currKey-1].classList.contains("incorrect"))) {
      if (altKey) {
        altDelete();
      } else {
        letters[currKey].classList.remove("currKey");
        letters[currKey - 1].classList.remove("incorrect", "correct");
        currKey --;
        letters[currKey].classList.add("currKey");
      }
  } else if (e.key.length === 1) {
    letters[currKey].classList.add("incorrect");
    letters[currKey].classList.remove("currKey");
    currKey ++;
    letters[currKey].classList.add("currKey");
  }
});

window.addEventListener('keyup', (e) => {
  if (e.key === "Alt") {
    altKey = false;
  }
});
