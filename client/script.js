
class TypeTest {
  constructor(letters) {
    this.letters = letters;
    this.currKey = 0;
    this.altKey = false;
    this.charsIncorrect = [];
    this.wordsIncorrect = [];
    this.startTime;
    this.end = false;
  }

  beginTest() {
    this.startTime = Date.now();
  }

  endTest() {
    this.end = true;

    const wpm = this.letters[0].parentElement.parentElement.children.length / ((Date.now() - this.startTime) / (1000 * 60));
    console.log(wpm);

    let string = "";
    for (const key in this.charsIncorrect) {
      string.concat(this.letters[key].parentElement.innerText)
      console.log(this.letters[key].parentElement.innerText)
    }
    console.log(string);

    document.getElementsByClassName("textContainer")[0].style.display = "none";
    const resultsScreen = document.getElementById("resultsScreen");
    resultsScreen.style.display = "block";
    resultsScreen.children[0].innerHTML = Math.round(wpm);
  }

  toggleAltKey() {
    this.altKey = !this.altKey;
  }

  convertCharValues(key) {
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
        return this.letters[this.currKey].innerText;
    }
  }

  updateScroll(element) {
    const textbox_top = element.parentElement.parentElement.getBoundingClientRect().top;
    const element_top = element.parentElement.getBoundingClientRect().top;

    if ((element_top - textbox_top)/element.parentElement.clientHeight >= 3) {
      const wordsToBeHidden = [];
      for (const word of document.getElementsByClassName('word')) {
        if (word.style.display === "none") continue;
        if (word.getBoundingClientRect().top === word.parentElement.getBoundingClientRect().top) {
          wordsToBeHidden.push(word)
        } else {
          break;
        }
      }
      for (const word of wordsToBeHidden) {
        word.style.display = "none";
      }
    }
  }

  updateMetrics() {
    // index of currWord will be words completed
    const wordsCompleted = [this.letters[this.currKey].parentElement.children].indexOf(this.letters[this.currKey]);

    const totalWords = this.letters[this.currKey].parentElement.children.length;

    document.getElementByClassName('wordsCompleted')[0].innerHTML = `${wordsCompleted}/${totalWords}`;
  }

  altDelete() {
    if ((this.letters[this.currKey-1].parentElement !== this.letters[this.currKey].parentElement && this.letters[this.currKey].innerHTML === "&nbsp;") || this.currKey == 0) return;

    this.letters[this.currKey].classList.remove("currKey");
    this.letters[this.currKey - 1].classList.remove("incorrect", "correct");
    this.currKey --;
    this.letters[this.currKey].classList.add("currKey");

    if (this.letters[this.currKey-1].innerHTML === "&nbsp;") return;
    this.altDelete();
  }

  updateText(key) {
    if (key === "Alt") {
      this.toggleAltKey();
      return;
    }

    const prevLetterCorrect = this.currKey > 0 ? !this.letters[this.currKey - 1].classList.contains("incorrect") : true;

    const currChar = this.convertCharValues(this.letters[this.currKey].innerHTML);

    if (key === currChar && prevLetterCorrect && key.length === 1) {
      this.letters[this.currKey].classList.remove("currKey");
      this.letters[this.currKey].classList.add("correct");
      this.currKey ++;
      this.letters[this.currKey].classList.add("currKey");
      this.updateScroll(this.letters[this.currKey]);
      this.updateMetrics();

      if (this.startTime == undefined) {
        this.beginTest();
      } else if (this.currKey === this.letters.length-1) {
        this.endTest();
      }
    }  else if (key === "Backspace" && this.currKey > 0 && (this.letters[this.currKey-1].parentElement == this.letters[this.currKey].parentElement || this.letters[this.currKey-1].classList.contains("incorrect"))) {
      if (this.altKey) {
        this.altDelete();
      } else {
        this.letters[this.currKey].classList.remove("currKey");
        this.letters[this.currKey - 1].classList.remove("incorrect", "correct");
        this.currKey --;
        this.letters[this.currKey].classList.add("currKey");
      }
    } else if (key.length === 1) {
      this.letters[this.currKey].classList.add("incorrect");
      this.letters[this.currKey].classList.remove("currKey");

      // if first wrong char add to wrong char array
      if (this.currKey === 0 || this.letters[this.currKey - 1].classList.contains("correct")) {
        this.charsIncorrect.push(this.currKey)
      }

      if (this.currKey === this.letters.length - 1) return ;
      this.currKey ++;
      this.letters[this.currKey].classList.add("currKey");
    }
  }
}

const currentTypeTest = new TypeTest(document.getElementsByClassName('letter'));

window.addEventListener('keydown', (e) => {
  if (!currentTypeTest.end) {
    currentTypeTest.updateText(e.key);
  }
});

window.addEventListener('keyup', (e) => {
  if (e.key === "Alt" && !currentTypeTest.end) {
    currentTypeTest.toggleAltKey();
  }
});
