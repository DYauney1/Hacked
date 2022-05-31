const body = document.querySelector('body');
const chars = "1234567890ABCDEF";
let menuVisibile = false;
let canInterrupt = true;
const timeoutInterval = 5000;

/**
 * random - I made this primarily for legibility purposes
 * in the createChar function, because things there got
 * really confusing to read. woot.
 *
 * @param  {int} from=0   starting number, beginning of range
 * @param  {int} to=1     ending number, end of range
 * @param  {int} places=0 places to round the number to
 * @return {number}       number within range, rounded to places
 */
function random(from=0, to=1, places=0) {
  return Math.round(Math.random() * (to - from) * 10**places + from, places) / 10**places;
}

/**
 * createChar - creates an html element containing a random, or specified
 * string of characters, then places it randomly on the page with linked
 * styles and a timer for deletion
 *
 * Yeah, it's technically only called once, but it's called in a place
 * which would be awkward to just write in manually, so it's defined here
 *
 * @param  {string} char="" text to be generated. pulls from chars by default
 * @return {null}           does not return a value
 */
function createChar(char="Random", lifeSpan=10000) {
  if(char === "Random") {
    char = chars.charAt(parseInt(Math.random() * chars.length))
  }

  let elem = document.createElement("span");
  elem.innerText = char;
  elem.style.top = random(-20, 80) + "vh";
  elem.style.left = random(-0.5, 100, 2) + "vw";
  elem.style.animationDuration = random(400, 1200) + "ms";
  elem.style.fontSize = random(35, 50 * char.length) + "px";
  elem.classList.add("code", "noselect");

  // body.appendChild(elem);
  body.insertBefore(elem, document.querySelector("#main"));

  //self destruct sequence, basically, to keep things fresh
  setTimeout(function(){elem.remove()}, lifeSpan)
}




function helpMenu() {
  document.querySelector("#help").innerHTML = "";

  function addItem(parent, type, text, ...classes) {
    let elem = document.createElement(type);
    elem.innerText = text;
    if(classes.length != 0) elem.classList.add(classes);

    document.querySelector(parent).appendChild(elem);
  }

  for(const [key, value] of Object.entries(helpInfo)) {
    addItem("#help", "div", "", "row")
    addItem("#help > div:last-child", "span", key, "key");
    addItem("#help > div:last-child", "span", value, "explanation");

    document.querySelector("#help > div:last-child").title = value;
    document.querySelector("#help > div:last-child").addEventListener("click", function() {
      process(key);
      if(key != "?") process("?");
    });

  }

  if(menuVisibile) {
    document.querySelector("#help").classList.remove("grow");
    document.querySelector("#help").classList.add("shrink");

    setInterruptTimer(false);

  } else {
    document.querySelector("#help").classList.remove("shrink");
    document.querySelector("#help").classList.add("grow");

    setInterruptTimer(true);

  }
  menuVisibile = !menuVisibile;
}

let interruptTimer;
function setInterruptTimer(setUp=false) {

  canInterrupt = false;

  if(setUp) {

    clearInterval(interruptTimer);

  } else {

    interruptTimer = setTimeout(function() {
      canInterrupt = true;
    }, timeoutInterval)
  }
}


function cover(setUp=false) {

  if(setUp) {
    let elem = document.createElement("div");
    elem.classList.add("cover");
    body.appendChild(elem);

    setInterruptTimer(true);


  } else if(document.querySelector(".cover")) {

    document.querySelector(".cover").remove();
    setInterruptTimer();


  } else if(canInterrupt) {

    alert(`Yield yourselves up unto us, and unite with us and become acquainted with our secret works, and become our brethren that ye may be like unto us - not our slaves, but our brethren and partners of all our substance.`);

    setInterruptTimer();
  }

}

let creatorInterval = [];
function process(codeType) {

  // console.log(`Key Pressed: ${codeType}`)

  function createWith(char, lifeSpan, coolDown, removePrevious=true) {
    if(removePrevious) {
      creatorInterval.forEach(creator => clearInterval(creator));
    }
    creatorInterval.push(window.setInterval(createChar, coolDown, char, lifeSpan));
  }

  switch (codeType) {
    case "?":
      helpMenu();
      break;
    case "!":
      createWith("Random", 4000, 500);
      break;
    case "@":
      createWith("Random", 5000, 100);
      break;
    case "#":
      createWith("Random", 10000, 20);
      break;
    case "$":
      createWith("🦄", 3000, 400);
      break;
    case "%":
      createWith("Random", 4000, 500);
      createWith("🦄", 3000, 400, false);
      break;
    case "L":
      createWith("LOL", 4000, 400);
      break;
    case "F":
      body.className = "flashy";
    case "Q":
      creatorInterval.forEach(element => clearInterval(element));
      break;
    case "C":
      body.className = "graygreen";
      process("!");
      break;
    case "V":
      body.className = "graygreen";
      process("Q");
      break;
    case "B":
      body.style.background = "#314131";
      process("V");
      process("#");
      document.querySelector("#main").classList.add("nonexistant");
      break;
    case "Escape":
      if(menuVisibile) process("?");
      break;
    case "S":
      cover(true);
      break;
    default:
  }
}

let helpInfo = {
  "?": 'Show/hide help menu',
  "S": 'Covers screen in black',
  "F": 'Switches to flashing background',
  "C": 'Switches to matrix (slow)',
  "!": 'Starts matrix (slow)',
  "@": 'Starts matrix (medium)',
  "#": 'Starts matrix (fast)',
  "$": 'Starts unicorn matrix',
  "%": 'Starts slow text/unicorn matrix',
  "Q": 'Stops matrix',
  "L": 'Starts "LOL" matrix numbers',
  "V": 'Switches to matrix colors',
  "B": 'Switches to matrix (slow), removes main text'
}


body.addEventListener("mousemove", function() {cover(false)})

body.addEventListener("keyup", function() {process(event.key)})

//the actual return value does not matter on virtually every
// browser, but I thought it'd be funny to say Panic!!.
// This line prevents a refresh, or closing of the page,
// as long as the page has been clicked on since being loaded
window.addEventListener("beforeunload", function(event) {event.returnValue = "Panic!!!"});
