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
  var SHORT_INTERVAL = 1500;
  var LONG_INTERVAL = SHORT_INTERVAL * 1.5;
  const WEDGES = ['green', 'red', 'blue', 'yellow'];
  const MOVES = 20;

  /* set listeners */
  start.addEventListener('click', startPress, false);
  strict.addEventListener('click', useStrict, false);
  for (let i = 0; i < WEDGES.length; i++) {
    document.getElementById(WEDGES[i]).addEventListener('click', wedgeClick, false);
  }
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
    }, 500);
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
    gameArr = [],
    playerArr = [],
    currentStep = 1,
    playerMoves = 0,
    timeListen = SHORT_INTERVAL * this.currentStep,
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
    reset = function() {
      console.log("Game reset");
      gameStarted = false;
      sequence = fillSequence();
      playerArr = [];
      currentStep = 1;
      return true;
    },
    /** Lights up a wedge for a period of time. */
    lightUp = function(colour) {
      console.log("*******lightUp() colour: ", colour);
      var wedge = document.getElementById(colour);
      wedge.classList.add('light');
      wedge.classList.remove('dark');
      setTimeout(function () {
        wedge.classList.add('dark');
        wedge.classList.remove('light');
      }, SHORT_INTERVAL);
    },
    playSequence = function() {
      console.log(currentStep);
      var i = 0;
      function lightSequence() {
        lightUp(sequence[i]);
        i++;
        if (i < currentStep) {
          setTimeout(lightSequence, LONG_INTERVAL)
        }
      }
      lightSequence();
    };


    /* public functions */
    this.start = function() {
      console.log("****** new Game started");
      reset();
      gameStarted = true;
      // set number of steps to 1
      currentStep = 5;
      while (gameStarted) {
        // play sequence up to currentStep
        playSequence();
        gameStarted = false; // remove this later
        // wait for response

        // fill response array
        // check response array element against corresponding element in sequence array
        // if wrong, indicate error
        // start sequence again from beginning
        // if correct increment currentStep and play sequence again
      }


      //setTimeout(this.aiTurn, SHORT_INTERVAL);
    };






    this.displayMoves = function() {
      var i = 0;
      l = this.gameArr.length;
      (function loop() {
        console.log("this.gameArr[i]:", this.gameArr[i],'i:', i);
        this.lightUp(this.gameArr[i]);
        if (++i < l) {
          setTimeout(loop, SHORT_INTERVAL);
        } else {
            this.playerOn();
        }
      })(); // loop called immediately to start it off

    };
    this.playerOn = function() {
      console.log('****** playerOn()')
      this.playerTurn = true;
      console.log("this.playerTurn:", this.playerTurn);
      this.playerArr = [];
      startTiming();
    }
    this.playerOff = function() {
      console.log("playerOff!");
      this.playerTurn = false;
      console.log('this.playerTurn:', this.playerTurn);
    }
    this.aiTurn = function() {
      console.log("******* this.AiTurn()");
      for (i=0; i<currentStep; i++) {
        console.log('showing a colour')
      }
    }
    this.makePlayerMove = function(colour) {
      console.log("******makePlayerMove(),currentStep:", this.currentStep);
      this.playerArr.push(colour)
      console.log('this.playerArr:',this.playerArr)
      this.playerMoves++;
      console.log('this.playerMoves:', this.playerMoves);
      if (this.playerMoves == this.currentStep) {
        this.compare();
      }
    }
    this.compare = function() {
      console.log('*******compare()')
      for (let i=0; i<this.currentStep; i++) {
        if (this.gameArr[i] == this.playerArr[i]) {
          console.log('i:',i, 'is same');
        } else {
          console.log("i", i, "is different");
          console.log("start again");
          this.playerTurn = false;
          if (strictOn) {
            this.reset();
            this.start();
          } else {
            console.log('replay moves');
            // REPLAY MOVES
            setTimeout(this.displayMoves, SHORT_INTERVAL);
          }
          return;
        }
      }
      this.aiTurn();
    }
  }; // end Game class

  /* DO We need this?
  function startTiming() {
    console.log('-------startTiming()');
    // TODO: MAKE THIS WORK WITH ranOutOfTime!!
  };
  */
  var timer;
  function ranOutOfTime() {
    clearTimeout(timer)
    timer = setTimeout(function() {
      if (game.playerArr.length < game.gameArr.length) {
        console.log("ranOutOfTime returning true");
        return true;
      }
      console.log("ranOutOfTime returning false");
      return false;
    }, game.timeListen);
  }; // end ranOutOfTime

  function wedgeClick(e) {
    var w = e.target.id;
    console.log("wedgeClick():", w, 'was clicked');
    console.log("game.playerTurn is ", game.playerTurn)
    if (game.playerTurn == true && game.playerArr.length < game.currentStep) {
      game.makePlayerMove(w);
    } else {
      console.log('now turn for AI again');
    }
  }

  /** TODO: DELETE?
  this.addToSequence = function() {
    console.log("*********game.addToSequence()")
    if (this.currentStep >= 0 && this.currentStep < 20) {
      var rand = this.random();
      console.log("rand from addToSequence", rand);
      this.gameArr.push(WEDGES[rand]);
      this.currentStep++;
      console.log("currentStep", this.currentStep);
      console.log("gameArr length", this.gameArr.length);
      console.log("gameArr", this.gameArr);
    }
    this.displayMoves();
  };
  */

}); // end DOMContentLoaded
