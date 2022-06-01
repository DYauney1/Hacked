const body = document.querySelector('body');
const menu = document.querySelector("#menu");
const chars = "1234567890ABCDEF";
let menuVisible = false;
let interruptable = false;
let canInterrupt = interruptable;
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



function toggleMenu(menuSetType=menu.type) {
  //helper function for help menu
  function addItem(parent, type, text, ...classes) {
    let elem = document.createElement(type);
    elem.innerText = text;
    if(classes.length != 0) classes.forEach(element => elem.classList.add(element));

    document.querySelector(parent).appendChild(elem);
  }

  //helper function for source menu
  function addSource(item) {

    let elem = document.createElement("div");
    elem.innerText = item;
    elem.classList.add("source")
    menu.appendChild(elem);
  }


  //prevents closing when switch should occur
  if(!(menuVisible && menuSetType != menu.type)) menuVisible = !menuVisible;

  //resets the innerHTML only when needed
  if(menuSetType != menu.type) {

    menu.innerHTML = "";

    switch (menuSetType) {
      case "help":

      menu.type = "help";

      //adds column labels at the top
      addItem("#menu", "div", "", "row")
      addItem("#menu > div:last-child", "span", "Key (case sensitive)", "key");
      addItem("#menu > div:last-child", "span", "Action performed", "explanation");
      document.querySelector("#menu > div:last-child").title = "Having trouble? Keep 'Shift' pressed down until after the other key has been released!";

      //iterates through helpInfo, creates row for each key/value
      for(const [key, value] of Object.entries(helpInfo)) {
        addItem("#menu", "div", "", "row", "row-hoverable")
        addItem("#menu > div:last-child", "span", key, "key");
        addItem("#menu > div:last-child", "span", value, "explanation");

        document.querySelector("#menu > div:last-child").title = value;
        document.querySelector("#menu > div:last-child").addEventListener("click", function() {
          process(key);
          //don't shrink if it's a menu one
          if(!key.match(/[<+?>]/)) process("?");

        });

      }
      break;
      case "sources":
        console.log("Sources triggered")

        //crazy that it's so much simpler than the other one...
        menu.type = "sources";
        sourcesInfo.forEach(item => addSource(item));
        break;
      default:

    }

  }


  if(menuVisible) {
    console.log("menu is visible")
    menu.classList.remove("shrink");
    menu.classList.add("grow");

    setInterruptTimer(true);

  } else {

    console.log("menu is not visible")

    menu.classList.remove("grow");
    menu.classList.add("shrink");

    setInterruptTimer(false);
  }
}


let interruptTimer;
function setInterruptTimer(setUp=false) {
  canInterrupt = false;

  //makes dev a lot easier
  if(!interruptable) return false;

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

    //for leniency cooldown purposes
    setTimeout(function() {
      canInterrupt = true;
    }, 2500)


  } else if(canInterrupt) {

    if(document.querySelector(".cover")) {

     document.querySelector(".cover").remove();
     setInterruptTimer();

    } else {

      alert(`Yield yourselves up unto us, and unite with us and become acquainted with our secret works, and become our brethren that ye may be like unto us - not our slaves, but our brethren and partners of all our substance.`);

      setInterruptTimer();
    }
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
      toggleMenu("help");
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
      document.querySelector("#main").classList.remove("nonexistant");
      process("!");
      break;
    case "V":
      body.className = "graygreen";
      process("Q");
      break;
    case "J":
      interruptable = !interruptable;
      setInterruptTimer(!interruptable);
      break;
    case "B":
      body.style.background = "#314131";
      process("V");
      process("#");
      document.querySelector("#main").classList.add("nonexistant");
      break;
    case "Escape":
      if(menuVisible) toggleMenu(menu.type);
      break;
    case "S":
      cover(true);
      break;
    case "<":
    case ">":
      process("V");
      toggleMenu("sources");
      break;
    default:
  }
}

const helpInfo = {
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
  "B": 'Switches to matrix (slow), removes main text',
  "J": 'Toggles if popups can pop up',
  "Bugged": 'Shows sources & dev story'
}

const sourcesInfo = [
`This project has been thoroughly enjoyable for me to make. I started out simply hoping to make a basic little project that looked bad (intentionally, yeah) but as time went on I began to realize how much potential there was for different little jokes, as well as a quality system bridging them together, so I put the time in and I made it happen (or at least I tried...).`,

`The first one was what is now the default, the flashing background (though the colors have, and probably will continue to change). The idea for this one came from Elder Wright, as did half of the project as a whole. The flashing background was originally done in javascript, but I learned that @keyframe could be of use, and I had lots of fun learning how to use it.`,

`With that css journey under my belt, I went on to make the first iteration of the Matrix, though it was in a separate file. After some tinkering and changes, I decided that I could actually merge the flashing background into this site. Ironically, with most of the project done, that's where the journey began.`,

`The idea for this style of matrix comes from a documentary I watched in my freshman year of high school, where the background looked like this whenever they talked about something techy, and the kid sitting next to me pointed out that the background was actually just repeating downwards numbers, and I've never forgotten about it.`,

`I started cleaning up the code, and testing out different features and options, like the unicorns, the menu, and others that didn't work out like the rickroll and the wake lock. I put a decent chunk of my free time into the project, and by the end of the weekend I had something that I was willing to show to someone else, and Elder Wright loved it. I thought I could do better though.`,

`This is pretty much the present, but I do still have a couple more shout-outs and mentions for the project, but as the story goes on I intend to add to this with all my notes and thoughts.`,

`This project was created entirely from scratch, using HTML, CSS, and JavaScript.`,

`This project was created entirely within the Atom text editor/IDE, and is publicly available on GitHub (though I won't tell you where).`,

`This project was not officially approved by anyone, but the enthusiasm I received while making it was enough to keep me going.`,

`Made with love by Elder Yauney`
]


body.addEventListener("mousemove", function() {cover(false)})

body.addEventListener('click', function(event) {
  if(menuVisible && !menu.contains(event.target)) {

    toggleMenu();

  }
})

body.addEventListener("keyup", function() {process(event.key)})

//the actual return value does not matter on virtually every
// browser, but I thought it'd be funny to say Panic!!.
// This line prevents a refresh, or closing of the page,
// as long as the page has been clicked on since being loaded
window.addEventListener("beforeunload", function(event) {event.returnValue = "Panic!!!"});
