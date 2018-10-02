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
  // global variables 
  const FLASH = 250,
    SHORT_INTERVAL = 1500,
    LONG_INTERVAL = SHORT_INTERVAL * 1.2,
    MOVES = 20;

  const WEDGES = {
    colours: ['green', 'red', 'blue', 'yellow'],
    // Causes a wedge of specified colour to brighten and then dim 
    lightup (colour, speed, func) {
      console.log('lightup');
      let wedge = this.getWedge(colour);
      this.brighten(wedge);
      setTimeout(function() {
        WEDGES.dim(wedge);
        func ? func() : null;
      }, speed);
    },
    // Turns on listeners for this.colours
    openWedges() {
      console.log('openWedges()');
      for (let i = 0; i < this.colours.length; i++) {
        document.getElementById(this.colours[i]).classList.remove('closed');
        document.getElementById(this.colours[i]).classList.add('open');
        document.getElementById(this.colours[i]).addEventListener('click', this.wedgeClick, false);
      }
    },
    // Turns off listeners for wedges. 
    closeWedges() {
      console.log('closeWedges(), playerTurn is: ', states.playerTurn);
      for (let i = 0; i < this.colours.length; i++) {
        document.getElementById(this.colours[i]).classList.remove('open');
        document.getElementById(this.colours[i]).classList.add('closed');
        document.getElementById(this.colours[i]).removeEventListener('click', this.wedgeClick, false);
      }
    },
    // Lights up a wedge 
    brighten(wedge) {
      wedge.classList.add('light');
      wedge.classList.remove('dark');
    },
    // Dims a wedge
    dim(wedge) {
      wedge.classList.add('dark');
      wedge.classList.remove('light');        
    },
    // Gets a wedge 
    getWedge(colour) {
      return document.getElementById(colour);
    },
    wedgeClick (e) {
      return stateModifiers.dealWithClick(e.target.id);
    }
  }

  function Game() {
    // private methods
    let startRound = () => {
      let round = new Round();
      round.start();
    };
    // public methods
    this.start = () => {
      console.log("game started");
      states.gameStarted = true;
      console.log('states.gameStarted:', states.gameStarted);    
      startRound();
    };
  }
  
  // buttons 
  var start = document.getElementById('start'),
    strict = document.getElementById('strict'),
    strictIndicator = document.getElementById('strict-indicator'),
    strictOn = false;
  // set listeners on buttons
  start.addEventListener('click', startPress, false);
  strict.addEventListener('click', useStrict, false);

  // button presses 
  function buttonDown(button) {
    button.classList.add('pressed');
  }

  function buttonUp(button) {
    button.classList.remove('pressed');
  }

  // strict mode 
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

  // Initiates a game. 
  function startPress() {
    console.log('startPress');
    let game = new Game();
    game.start();
  }

  // Game states and methods that modify them
  let states = {
    gameStarted: false,
    //computer variables
    sequence: [],
    currentStep: 1,  // where we are in the sequence
    //player variables
    playerTurn: false,
    numPlayerClicks: 0,
    correct: true,
    sequencePlayed:false,
  }

  let stateModifiers = {
    init() {
      states.gameStarted = false;
      states.sequence = [];
      states.playerTurn = false;
      states.currentStep = 1;
      states.numPlayerClicks = -1;
      states.correct = true;
      console.log('states.init', states.gameStarted, states.sequence, states.playerTurn, states.currentStep, states.numPlayerClicks, states.correct);
    },
    setCorrect(bool) {
      states.correct = bool;
      console.log('setCorrect(), states.correct:', states.correct);
    },
    // Generates a random number between 0 and 3.
    randomColourIndex() {
      return Math.floor(Math.random() * 3);
    },
    // Fills the sequence with a MOVES number of random indices of the wedge colours
    fillSequence() {
      for (i = 0; i < MOVES; i++) {
        states.sequence.push(WEDGES.colours[this.randomColourIndex()]);
      }
      console.log('fillSequence(), states.sequence is:', states.sequence);
    },
    incrementClicks() {
      console.log('incrementClicks(), numPlayerClicks:', states.numPlayerClicks + 1);
      return states.numPlayerClicks++;      
    },
    dealWithClick(colour) {     
      //TODO: make this work! 
      console.log('dealWithClick(), colour:', colour, 'states.numPlayerClicks: ', states.numPlayerClicks);
      WEDGES.lightup(colour, FLASH, stateModifiers.compareSequence(colour));
      //this.compareSequence(colour);      
      if (this.incrementClicks() < states.currentStep-2) {        
        console.log('numPlayerClicks', states.numPlayerClicks, 'currentStep', states.currentStep);
        // TODO: go to next step
        console.log('need to go to next step now');
      } else {
        this.resetClicks();
        this.playerStop();
      }
    },
    resetClicks() {
      states.numPlayerClicks = 0;
    },
    compareSequence(colour) {    
      console.log('compareSequence','sequence', states.sequence, 'colour', colour);
      return this.setCorrect(colour === states.sequence[states.numPlayerClicks]);///FIX!!!
    },
    playerStop() {
      this.setPlayerTurnState(false);
    },
    setSequencePlayedState (bool) {
      console.log('setSequencePlayedState() with: ', bool);
      states.sequencePlayed = bool;
      if (bool) {
        this.setPlayerTurnState(bool);
      }
    },
    setPlayerTurnState(bool) {
    console.log('setPlayerTurnState with:', bool);
      states.playerTurn = bool;
      if (bool) {
        WEDGES.openWedges();        
      } else {
        WEDGES.closeWedges();
      }
      console.log('playerTurn()', states.playerTurn);
    }    
  };
  
  function Round() {        
    //private methods
    let end = () => {
      console.log("round ended!");
    },
    playSequence = (i, arr) => {
      stateModifiers.setSequencePlayedState(false);
      if (arr[i]) {
          WEDGES.lightup(arr[i], SHORT_INTERVAL, null);
          setTimeout(function(){playSequence(i+1, arr);}, SHORT_INTERVAL + 200);
      } else {
        console.log('sequence played');
        return stateModifiers.setSequencePlayedState(true);
      }
    },
    incrementSteps = () => {
      states.currentStep++;
      console.log('currentSteps incremented to', currentSteps);
    };
    //public methods
    this.start = () => {
      console.log("round started!");
      stateModifiers.init();
      stateModifiers.fillSequence();
      console.log('states.sequence after fillSequence() in Round.start()', states.sequence);
      console.log("states.gameStarted, states.sequence, states.playerTurn",states.gameStarted, states.sequence, states.playerTurn);
      let currentStepSequence = states.sequence.slice(0, states.currentStep);
      console.log('currentStepSequence', currentStepSequence);
      playSequence(0, currentStepSequence);
    }
  }


}); // end DOMContentLoaded



    /* buttons 
  var start = document.getElementById('start'),
    strict = document.getElementById('strict'),
    strictIndicator = document.getElementById('strict-indicator'),
    strictOn = false,
    stepStarted = false;

  /* global variables 
  const FLASH = 250,
    SHORT_INTERVAL = 1500,
    LONG_INTERVAL = SHORT_INTERVAL * 1.5,
    WEDGES = ['green', 'red', 'blue', 'yellow'],
    MOVES = 20;

  /* set listeners 
  start.addEventListener('click', startPress, false);
  strict.addEventListener('click', useStrict, false);

  /* button presses 
  function buttonDown(el) {
    el.classList.add('pressed');
  }

  function buttonUp(el) {
    el.classList.remove('pressed');
  }

  /* strict mode 
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

  /** Initiates a game. 
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
  /** Wedge functions. 
  function Wedge() {
    //Todo: move wedge functions here 
  }
  /**
   * Represents a game of Simon.
   
  function Game() {
    /* private 
    var gameStarted = false,
      //hasFlashed = false,
      playerTurn = false,
      sequence = [],
      //playerArr = [],
      // set number of steps to 1
      currentStep = 1,
      pointInSequence = -1,
      playerMoves = 0,
      playerGo = () => {
        startPlayerTurn();
        openWedges();
        return true;
      },
      playerStop = () => {
        closeWedges();
        endPlayerTurn();
        console.log('playerStop, playerTurn:', playerTurn);
      }
      /** Turns on listeners for wedges. 
      openWedges = function() {
        console.log('openWedges()');
        for (let i = 0; i < WEDGES.length; i++) {
          document.getElementById(WEDGES[i]).classList.remove('closed');
          document.getElementById(WEDGES[i]).classList.add('open');
          document.getElementById(WEDGES[i]).addEventListener('click', wedgeClick, false);
        }
        /*
        setTimeout(function() {
          playerStop();
        }, LONG_INTERVAL * currentStep);
      },
      /** Turns off listeners for wedges. 
      closeWedges = function() {
        console.log('closeWedges(), playerTurn: ', playerTurn);
        for (let i = 0; i < WEDGES.length; i++) {
          document.getElementById(WEDGES[i]).classList.remove('open');
          document.getElementById(WEDGES[i]).classList.add('closed');
          document.getElementById(WEDGES[i]).removeEventListener('click', wedgeClick, false);
        }
      },
      /** Generates a random number between 0 and 3.
      randomColourIndex = function() {
        return Math.floor(Math.random() * 3);
      },
      /** Returns an array with random numbers between 0 and 3.
      fillSequence = function() {
        arr = []
        for (i = 0; i < MOVES; i++) {
          arr.push(WEDGES[randomColourIndex()]);
        }
        console.log('sequence', arr)
        return arr;
      },
      /** Resets the game.
      resetGame = function() {
        console.log('Game resetGame');
        gameStarted = false;
        sequence = fillSequence();
        resetPlayerMoves();
        return true;
      },
      /** Lights up a wedge 
      brighten = function(wedge) {
        wedge.classList.add('light');
        wedge.classList.remove('dark');
      },
      /** Dims a wedge 
      dim = (wedge) => {
        wedge.classList.add('dark');
        wedge.classList.remove('light');        
      },
      /** Gets a wedge 
      getWedge = (colour) => {
        return document.getElementById(colour);
      },
      
      flashed = function() {
        hasFlashed = true;
      },
      /** Causes a wedge of specified colour to brighten and then dim 
      lightup = (colour, speed, func) => {
        console.log('lightup');
        let wedge = getWedge(colour);
        brighten(wedge);
        setTimeout(function() {
          dim(wedge);
          func ? func() : null;
        }, speed);
      }, 
      /** Plays a sequence of coloured buttons 
      /*plightuplaySequence = function(currentSteps) {
        console.log('playSequence(), currentSteps', currentSteps);
        for (let i=0; i<currentSteps; i++) {
          setTimeout(function() {
            lightup(sequence[i], SHORT_INTERVAL);
          }, LONG_INTERVAL * i);
        }
      }
      playSequence = function(currentSteps) {
        console.log('playSequence(), currentSteps', currentSteps);
        lightup(sequence[0], SHORT_INTERVAL, flashed);
      },
      resetClicks = function() {
        pointInSequence = -1;
      },
      incrementClicks = function() {
        pointInSequence++;
      },
      wedgeClick = function(e) {
        incrementClicks();
        var buttonColour = e.target.id;
        lightup(buttonColour, FLASH, null);
        console.log('wedgeClick():', buttonColour, 'was clicked', 'playerTurn', playerTurn);
        if (playerTurn && pointInSequence <= currentStep) {
          compareSequence(pointInSequence, buttonColour);
        } else {
          playerStop();
          resetClicks();
        }
      },
      compareSequence = function(pointInSequence, colour) {
        console.log('compareSequence', 'pointInSequence', pointInSequence, 'sequence', sequence, 'colour', colour);
        //return colour == sequence[pointInSequence];
        if (colour === sequence[pointInSequence]) {
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
      endPlayerTurn = () => {
        playerTurn = false;
      },
      startPlayerTurn = () => {
        playerTurn = true;
      },
      incrementPlayerMoves = () => {
        playerMoves++;
      },
      resetPlayerMoves = () => {
        playerMoves = 0;
      },
      playRound = function() {
        // set player turn to false
        playerTurn = false;
        // play sequence up to currentStep
        for (let i=0; i<currentStep; i++) {
          // play sequence up to currentStep
          playSequence(currentStep);
          // open wedges for player
          playerGo();
          // fill player array with player's choices until array the same length as currentSteps
          
          // test whole player array for correctness
          // if wrong: make currentStep = 1
          // else: add another step and play sequence again
        } // end for
      },
      endRound = function() {
        //reset round to beginning
      },
      /** Plays a game of Simon 
      playGame = function() {
        playerArr = []
        gameStarted = true;
        playRound();
        // end game
        if (currentStep == MOVES) {
          gameStarted = false;
        }
      }; // end playGame
    /* public functions 
    this.start = function() {
      console.log('****** new Game started');
      resetGame();
      playGame();
    }; // end start()
  }; // end Game class*/
