// Initialisation
var breakLength = 300;
var sessionLength = 1500;
var clockTime = sessionLength;
var timerPaused = true;
var onBreak = false;

// Setters / Getters
function setBreakLength(newLength){
  breakLength = (newLength <= 0) ? 0 : newLength;
  notify();
}

function setSessionLength(newLength){
  sessionLength = (newLength <= 0) ? 0 : newLength;
  notify();
}

function setClockTime(secs){
  clockTime = secs;
  notify();
}

function getClockTime(){
  return clockTime;
}

// Timer
var intervalTimer;

function toggleTimer(){
  timerPaused = !timerPaused;
  !timerPaused ? startTimer() : stopTimer();
}

function startTimer(){
   notify();
   intervalTimer = setInterval(tick, 1000)
}

function stopTimer(){
  clearInterval(intervalTimer);
}

function tick(){    
      if (getClockTime() <= 0) {
          stopTimer();
          toggleBreak();
          return;
      }     
      setClockTime(getClockTime() - 1)      
}

function toggleBreak(){
     onBreak = !onBreak;
     setClockTime(onBreak ? breakLength : sessionLength);
     startTimer();
}

/*
  Controls
*/

function breakMinus(){incrementBreakLength(-60);}
function breakPlus(){incrementBreakLength(60);}
function sessionMinus(){incrementSessionLength(-60);}
function sessionPlus(){incrementSessionLength(60);}

function reset(){
  stopTimer();
  timerPaused = true;
  onBreak = false;
  setClockTime(sessionLength);
};


// Increment break length. If on break, and timer paused, reset clock to new length. 
function incrementBreakLength(increment){
  setBreakLength(breakLength + increment);
  if (timerPaused && onBreak) {
    clockSeconds = 0;
    setClockTime(breakLength);
  } 
}

// Increment session length. If in session, and timer paused, reset clock to new length. 
function incrementSessionLength(increment){
    setSessionLength(sessionLength + increment);
    if (timerPaused && !onBreak) {
      clockSeconds = 0;
      setClockTime(sessionLength);
    } 
}

/*
  Update View Function
*/
var notify = (function(){
  var prevBreakLength;
  var prevSessionLength;
  
  return function(){
    // Just always update clock.
    document.getElementById('timer').innerHTML = formatClockDisplay();
    document.getElementById('title').innerHTML = onBreak ? 'Break' : 'Session';    
    document.getElementById('fill').style.backgroundColor = onBreak ? 'red' : 'green';
    document.getElementById('fill').style.height = fillHeight();
    
    // Update Break Length
    if (prevBreakLength !== breakLength) {
      document.getElementById('break-length').innerHTML = breakLength / 60;      
       prevBreakLength = breakLength;
    }
    
    // Update Session Length
    if (prevSessionLength !== sessionLength)       {
      document.getElementById('session-length').innerHTML = sessionLength / 60;
      prevSessionLength = sessionLength;
    }   
  }
  
})();
/*
  Helpers
*/
function formatClockDisplay(){
  var time = getClockTime();
  var mins = Math.floor(time / 60);
  var secs = clockTime % 60;
  secs = secs < 10 ? '0' + secs : secs;
  return (timerPaused && time === sessionLength) ? mins : mins + ':' + secs; 
}

function fillHeight(){
  return 286 - ((getClockTime() / (onBreak ? breakLength : sessionLength)) * 286) + 'px';
}

// init view
document.addEventListener("DOMContentLoaded", function() {
  notify();
}, false);