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
    MOVES = 20,
    WEDGES = {
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
      },       
      // Generates a random number between 0 and 3.
      randomColourIndex() {
        return Math.floor(Math.random() * 3);
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
  }

  let stateModifiers = {
    init() {
      states.gameStarted = false;
      states.sequence = [];
      states.playerTurn = false;
      states.currentStep = 1;
      states.numPlayerClicks = 0;
      states.correct = true;
    },
    setCorrect(bool) {
      states.correct = bool;
      console.log('setCorrect(), states.correct:', states.correct);
    },
    incrementClicks() {
      console.log('incrementClicks(), numPlayerClicks:', states.numPlayerClicks + 1);
      return states.numPlayerClicks++;      
    },
    incrementStep() {
      states.currentStep++;
      console.log('currentStep incremented to', states.currentStep);
    },   
    // Returns an array containing a MOVES number of random indices of the wedge colours
    fillSequence() {
      for (i = 0; i < MOVES; i++) {
        states.sequence.push(WEDGES.colours[WEDGES.randomColourIndex()]);
      }
    },
    setPlayerTurnState(bool){
      console.log('setPlayerTurnState with:', bool);
        return states.playerTurn = bool;
        console.log('states.playerTurn()', states.playerTurn);
    },
    resetPlayerClicks() {
      console.log('resetPlayerClicks');
      return states.numPlayerClicks = 0;
    },
    compareSequence(colour) {    
      console.log('compareSequence','states.currentStepSequence', states.currentStepSequence, 'colour', colour, 'numPlayerClicks', states.numPlayerClicks, 'currentStepSequence.length', states.currentStepSequence.length);
      if (colour === states.currentStepSequence[states.numPlayerClicks-1]) {
        console.log('compareSequence is returning true');
        return this.nextStep(true);
      }
      console.log('compareSequence is returning false');
      return this.nextStep(false);
    },
    dealWithClick(colour) {
      console.log('dealing with click', colour); 
      this.incrementClicks();
      this.compareSequence(colour);
    },
    nextStep (bool) {
      // do this!!
      if (bool) {
        // do the next thing
          this.incrementStep();
          this.playSequence(0, states.currentStepSequence);
        } else {
        // start playing sequence from beginning
        this.resetPlayerClicks();
      }
    },
    playerStop () {
      console.log('playerStop');
      WEDGES.closeWedges(); 
      return this.setPlayerTurnState(false);
    },
    playerGo() {
      console.log('playerGo');
      WEDGES.openWedges();    
      return this.setPlayerTurnState(true);
    },
    playSequence (i, arr) {
      if (arr[i]) {
          WEDGES.lightup(arr[i], SHORT_INTERVAL, null);
          setTimeout(function(){stateModifiers.playSequence(i+1, arr);}, SHORT_INTERVAL + 200);
      } else {
        console.log('sequence played, returning playerGo');
        return this.playerGo();
      }
    }
  };
  
  function Round() {        
    //private methods
    let playerTurn = false,
    wrong = false,
    end = () => {
      console.log("round ended!");
    };
    //public methods
    this.start = () => {
      console.log("round started!");
      stateModifiers.init();
      stateModifiers.fillSequence();
      console.log('Round.sequence: ', states.sequence);
      console.log("states.gameStarted, states.sequence, playerTurn",states.gameStarted, states.sequence, playerTurn);
      states.currentStepSequence = states.sequence.slice(0, states.currentStep);
      console.log('currentStepSequence', states.currentStepSequence);
      stateModifiers.playSequence(0, states.currentStepSequence);
    }
  }


}); // end DOMContentLoaded

