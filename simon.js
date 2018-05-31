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

document.addEventListener("DOMContentLoaded", function () {

  /* buttons */
  var start = document.getElementById('start'),
    strict = document.getElementById('strict'),
    strictIndicator = document.getElementById('strict-indicator'),


    strictOn = false;

  /* global variables */
  const SHORT_INTERVAL = 1500;
  const LONG_INTERVAL = SHORT_INTERVAL * 1.5;
  const WEDGES = ['green', 'red', 'blue', 'yellow'];
  const MOVES = 20;

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
    console.log("strict status", strictOn);
  }
  /* start game */
  function startPress() {
    console.log("*******startPress");
    buttonDown(start);
    //timer then buttonup
    setTimeout(function () {
      buttonUp(start);
    }, 250);
    newgame = new Game();
    newgame.start()
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
    playerArr = [],
    currentStep = 1,
    playerMoves = 0,
    timeListen = SHORT_INTERVAL * currentStep,
	/** Turns on listeners for wedges. */
	openWedges = function() {
	  for (let i = 0; i < WEDGES.length; i++) {
		document.getElementById(WEDGES[i]).classList.remove('closed');
		document.getElementById(WEDGES[i]).classList.add('open');
		document.getElementById(WEDGES[i]).addEventListener('click', wedgeClick, false);
	  }
	},
    /** Generates a random number between 0 and 3.*/
    randomColourIndex = function() {
      return Math.floor(Math.random() * 3);
    },
    /** Returns an array with random numbers between 0 and 3.*/
    fillSequence = function() {
      arr = []
      for (i=0; i<MOVES; i++) {
        arr.push(WEDGES[randomColourIndex()]);
      }
      console.log('sequence', arr)
      return arr;
    },
    /** Resets the game.*/
    gameReset = function() {
      console.log("Game gameReset");
      gameStarted = false;
      sequence = fillSequence();
      playerArr = [];
      return true;
    },
    /** Lights up a wedge for a period of time. */
    lightUp = function(colour) {
      var wedge = document.getElementById(colour);
      wedge.classList.add('light');
      wedge.classList.remove('dark');
      setTimeout(function () {
        wedge.classList.add('dark');
        wedge.classList.remove('light');
      }, SHORT_INTERVAL);
    },
    /** Plays a sequence of coloured buttons */
    playSequence = function(numSteps) {
      console.log('numSteps',numSteps);
      var i = 0;
      function lightSequence() {
        lightUp(sequence[i]);
        i++;
        if (i < numSteps) {
          setTimeout(lightSequence, LONG_INTERVAL)
        }
      }
      lightSequence();
    },
    /** Reacts to clicks of the buttons, depending on whether it's the player's turn.*/
    reactToClick = function(buttonColour) {
      if (playerTurn) {
        playerArr.push(buttonColour)
      }
    },
    /** Listens for user clicking on coloured buttons.*/
    wedgeClick = function(e) {
      var buttonColour = e.target.id;
      console.log("wedgeClick():", buttonColour, 'was clicked');
      reactToClick(buttonColour);
    },
    /** Plays a game of Simon */
    playGame = function() {
      gameStarted = true;
      // set number of steps to 1
      currentStep = 0;
      while (gameStarted) {
		currentStep++;
        // play sequence up to currentStep
        playSequence(currentStep);
        gameStarted = false; // remove this later
        // wait for sequence to play
        var aiWait = LONG_INTERVAL * currentStep; 
        setTimeout(function() {
            playerTurn = true;
            console.log('playerTurn is true?', playerTurn)
			makePlayerMove();
        }, aiWait)
        // wait for response
        var playerWait = LONG_INTERVAL * currentStep * 2;
        setTimeout(function() {
          playerTurn = false;
            console.log('playerTurn is false?', playerTurn)
        }, playerWait)
        // check response array element against corresponding element in sequence array
        // if wrong, indicate error
        // start sequence again from beginning
        // if correct increment currentStep and play sequence again
        
        if (currentStep == MOVES) {
          gameStarted = false;
        }
      } // end while
  }, // end playGame
  /*
    aiTurn = function() {
      console.log("******* this.AiTurn()");
      // what are we doing here?
    }, */ //GET RID OF THIS?
    makePlayerMove = function(colour) {
	  openWedges();
      console.log("******makePlayerMove(),currentStep:", currentStep);
      playerArr.push(colour);
      console.log('this.playerArr:',playerArr);
      playerMoves++;
      console.log('this.playerMoves:', playerMoves);
      if (playerMoves == currentStep) {
        compare();
      }
    },
    compare = function() {
      // compare current click colour to array
      // if it's right, continue
      // if it's wrong, restart sequence


      // do we need this?
      //aiTurn();
    };
    /* public functions */
    this.start = function() {
      console.log("****** new Game started");
      gameReset();
      playGame();
    }; // end start()
  }; // end Game class

  /*var timer;
  function ranOutOfTime() {
    clearTimeout(timer)
    timer = setTimeout(function() {
      if (game.playerArr.length < game.sequence.length) {
        console.log("ranOutOfTime returning true");
        return true;
      }
      console.log("ranOutOfTime returning false");
      return false;
    }, game.timeListen);
  }; // end ranOutOfTime */

  /*
  function wedgeClick(e) {
    var w = e.target.id;
    console.log("wedgeClick():", w, 'was clicked');

  }*/ //TODO: DElETE?

  /** TODO: DELETE?
  this.addToSequence = function() {
    console.log("*********game.addToSequence()")
    if (this.currentStep >= 0 && this.currentStep < 20) {
      var rand = this.random();
      console.log("rand from addToSequence", rand);
      this.sequence.push(WEDGES[rand]);
      this.currentStep++;
      console.log("currentStep", this.currentStep);
      console.log("sequence length", this.sequence.length);
      console.log("sequence", this.sequence);
    }
    this.displayMoves();
  };
  */

}); // end DOMContentLoaded
