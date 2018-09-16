/*
USER STORIES
User Story: I am presented with a random series of button presses.

User Story: Each time I input a series of button presses correctly, I see the same series of button presses but with an additional step.

User Story: I hear a sound that corresponds to each button both when the series of button presses plays, and when I personally press a button.

User Story: If I press the wrong button, I am notified that I have done so, and that series of button presses starts again to remind me of the pattern so I can try again.

User Story: I can see how many steps are in the current series of button presses.

User Story: If I want to restart, I can hit a button to do so, and the game will return to a single step.

User Story: I can play in strict mode where if I get a button press wrong, it notifies me that I have done so, and the game restarts at a new random series of button presses.

User Story: I can win the game by getting a series of 20 steps correct. I am notified of my victory, then the game starts over.
*/

document.addEventListener('DOMContentLoaded', function() {

  /* buttons */
  var start = document.getElementById('start'),
    strict = document.getElementById('strict'),
    strictIndicator = document.getElementById('strict-indicator'),
    strictOn = false,
    stepStarted = false;

  /* global variables */
  const SHORT_INTERVAL = 1500,
    LONG_INTERVAL = SHORT_INTERVAL * 1.5,
    WEDGES = ['green', 'red', 'blue', 'yellow'],
    MOVES = 20;

  /* set listeners */
  start.addEventListener('click', startPress, false);
  strict.addEventListener('click', useStrict, false);

  /* button presses */
  function buttonDown(el) {
    el.classList.add('pressed');
  }

  function buttonUp(el) {
    el.classList.remove('pressed');
  }

  /* strict mode */
  function useStrict() {
    if (!strictOn) {
      buttonDown(strict);
      strictIndicator.classList.add('on');
      strictOn = true;
    } else {
      buttonUp(strict);
      strictIndicator.classList.remove('on');
      strictOn = false;
    }
    console.log('strict status', strictOn);
  }

  /** Initiates a game. */
  function startPress() {
    console.log('startPress');
    buttonDown(start);
    //timer then buttonup
    setTimeout(function() {
      buttonUp(start);
    }, 250);
    newgame = new Game();
    newgame.start()
  }
  /** Wedge functions. */
  function Wedge() {
    //Todo: move wedge functions here 
  }
  /**
   * Represents a game of Simon.
   * @constructor
   */
  function Game() {
    /* private */
    var gameStarted = false,
      playerTurn = false,
      sequence = [],
      //playerArr = [],
      // set number of steps to 1
      currentStep = 1,
      numClicks = -1,
      playerGo = function() {
        playerTurn = true;
      },
      playerStop = function() {
        playerTurn = false;
      }
      /** Turns on listeners for wedges. */
      openWedges = function(currentStep) {
        playerGo();
        console.log('openWedges(), playerTurn:', playerTurn);
        for (let i = 0; i < WEDGES.length; i++) {
          document.getElementById(WEDGES[i]).classList.remove('closed');
          document.getElementById(WEDGES[i]).classList.add('open');
          document.getElementById(WEDGES[i]).addEventListener('click', wedgeClick, false);
        }
        setTimeout(function() {
          closeWedges();
        }, LONG_INTERVAL * currentStep);
      },
      /** Turns off listeners for wedges. */
      closeWedges = function() {
        playerStop();
        console.log('closeWedges(), playerTurn: ', playerTurn);
        for (let i = 0; i < WEDGES.length; i++) {
          document.getElementById(WEDGES[i]).classList.remove('open');
          document.getElementById(WEDGES[i]).classList.add('closed');
          document.getElementById(WEDGES[i]).removeEventListener('click', wedgeClick, false);
        }
      },
      /** Generates a random number between 0 and 3.*/
      randomColourIndex = function() {
        return Math.floor(Math.random() * 3);
      },
      /** Returns an array with random numbers between 0 and 3.*/
      fillSequence = function() {
        arr = []
        for (i = 0; i < MOVES; i++) {
          arr.push(WEDGES[randomColourIndex()]);
        }
        console.log('sequence', arr)
        return arr;
      },
      /** Resets the game.*/
      gameReset = function() {
        console.log('Game gameReset');
        gameStarted = false;
        sequence = fillSequence();
        //playerArr = [];
        return true;
      },
      /** Lights up a wedge */
      glow = function(wedge) {
        wedge.classList.add('light');
        wedge.classList.remove('dark');
      },
      /** Dims a wedge */
      dim = (wedge) => {
        wedge.classList.add('dark');
        wedge.classList.remove('light');        
      },
      /** Gets a wedge */
      getWedge = (colour) => {
        return document.getElementById(colour);
      }
      ,
      lightup = (colour) => {
        console.log('lightup');
        let wedge = getWedge(colour);
        glow(wedge);
        setTimeout(function() {
          dim(wedge);
        }, SHORT_INTERVAL);
      }, 
      /** Plays a sequence of coloured buttons */
      playSequence = function(numSteps) {
        console.log('playSequence(), numSteps', numSteps);
        for (let i=0; i<numSteps; i++) {
          setTimeout(function() {
            lightup(sequence[i]);
          }, LONG_INTERVAL * i);
        }
      },
      resetClicks = function() {
        numClicks = -1;
      },
      incrementClicks = function() {
        numClicks++;
      },
      wedgeClick = function(e) {
        incrementClicks();
        var buttonColour = e.target.id;
        console.log('wedgeClick():', buttonColour, 'was clicked', 'playerTurn', playerTurn);
        var playerArrLength = playerArr.length;
        if (playerTurn && numClicks <= currentStep) {
          compareSequence(playerArrLength, buttonColour);
        } else {
          closeWedges();
          resetClicks();
        }
      },
      compareSequence = function(numClicks, colour) {
        console.log('compareSequence', 'numClicks', numClicks, 'sequence', sequence, 'colour', colour);
        //return playerArr[numClicks] == sequence[numClicks];
        if (colour === sequence[numClicks]) {
          console.log('compareSequence is returning true');
          return true;
        } else {
          console.log('compareSequence is returning false');
          return false;
        }
      },
      addStep = function() {
        currentStep++;
        console.log('addStep, currentStep: ', currentStep);
      },
      playRound = function() {
        // set player turn to false
        playerTurn = false;
        // play sequence up to currentStep
        for (let i=0; i<currentStep; i++) {
          // play sequence up to currentStep
          playSequence(currentStep);
          // open wedges for player
          setTimeout(function() {
            openWedges(currentStep);
          }, LONG_INTERVAL * currentStep);
          // fill player array with player's choices until array the same length as numsteps
          
          // test whole player array for correctness
          // if wrong: make currentStep = 1
          // else: add another step and play sequence again
        } // end for
      }
      /** Plays a game of Simon */
      playGame = function() {
        playerArr = []
        gameStarted = true;
        playRound();
        // end game
        if (currentStep == MOVES) {
          gameStarted = false;
        }
      }; // end playGame
    /* public functions */
    this.start = function() {
      console.log('****** new Game started');
      gameReset();
      playGame();
    }; // end start()
  }; // end Game class
}); // end DOMContentLoaded
