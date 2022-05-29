const body = document.querySelector('body');
const backgroundColors = ["#ff3a36", "#df741c", "#dfa41c", "#e28129", "#b215f3"];
let colorIndex = -1;


function changeBackground() {
  colorIndex++;
  colorIndex %= backgroundColors.length;

  body.style.background = backgroundColors[colorIndex]
}


window.addEventListener("beforeunload", function(event) {event.returnValue = "Panic!!!"});

window.setInterval(changeBackground, 200)


changeBackground()

let canInterrupt = true;

/**
 * setNephi - This function, in conjunction with the variable
 * canInterrupt, is used to make sure that the alert isn't
 * triggered too often
 *
 * @return {null}  does not return a value
 */
function setNephi() {
  if(canInterrupt) {
    alert("Yield yourselves up unto us, and unite with us and become acquainted with our secret works, and become our brethren that ye may be like unto us - not our slaves, but our brethren and partners of all our substance");
    canInterrupt = false;

    setTimeout(function() {
      canInterrupt = true;
    }, 7500)
  }
}
body.addEventListener("mousemove", setNephi)
