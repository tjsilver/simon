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
    MOVES = 3, //20,
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
        return player.dealWithClick(e.target.id);
      },       
      // Generates a random number between 0 and 3.
      randomColourIndex() {
        return Math.floor(Math.random() * 3);
      }
  }

  
  // buttons 
  var start = document.getElementById('start'),
    strict = document.getElementById('strict'),
    strictIndicator = document.getElementById('strict-indicator');

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
    if (!states.strict) {
      buttonDown(strict);
      strictIndicator.classList.add('on');
      states.strict = true;
    } else {
      buttonUp(strict);
      strictIndicator.classList.remove('on');
      states.strict = false;
    }
    console.log('strict status', states.strict);
  }

  // Initiates a game. 
  function startPress() {
    console.log('startPress');
    let game = new Game();
    game.start();
  }

  // Functions that deal with the player clicks
  let player = {
    dealWithClick(colour) {
      console.log('dealing with click', colour); 
      WEDGES.lightup(colour, FLASH, null);
      stateModifiers.incrementClicks();
      this.compareColours(colour);
    },
    compareColours(colour) {    
      console.log('compareColours','states.currentStepSequence', states.currentStepSequence, 'colour', colour, 'numPlayerClicks', states.numPlayerClicks, 'currentStepSequence.length', states.currentStepSequence.length);
      if (colour === states.currentStepSequence[states.numPlayerClicks-1]) { // colours match?
        console.log('compareColours is returning true');
        return this.nextStep(true);
      }
      console.log('compareColours is returning false');
      return this.nextStep(false);
    },
    nextStep (bool) {
      if (bool && states.gameOn) { // colours matched on last test
        if (states.numPlayerClicks === MOVES) { // player has won! 
          stateModifiers.turnGameOff();
          this.playerStop();
          // display that player has won TODO
          console.log('YOU WON!!')
        } else if (states.numPlayerClicks === states.currentStep) { // max number of clicks reached
          this.playerStop();
          setTimeout(function(){computer.addStepPlaySequence();}, LONG_INTERVAL);
        } 
      } else { //colours didn't match, so play sequence from beginning or start new sequence if strict
        this.playerStop();
        if (states.strict) { //strict mode is on so start a new round and sequence
          setTimeout(function(){
            round = new Round();
            round.start();
          }, LONG_INTERVAL);
          
        } else { // play up to the currentstep again
          setTimeout(function(){computer.playSequence(0, states.currentStepSequence);}, LONG_INTERVAL);
        }        
      }
    },
    playerStop () {
      console.log('playerStop');
      WEDGES.closeWedges(); 
      return stateModifiers.setPlayerTurnState(false);
    },
    playerGo() {
      console.log('playerGo');
      WEDGES.openWedges();
      stateModifiers.resetPlayerClicks();   
      return stateModifiers.setPlayerTurnState(true);
    }
  }
  // Game states and methods that modify them
  let states = {
    strict: false
  }

  let stateModifiers = {
    turnGameOn(){
      states.gameOn = true;
    },
    turnGameOff() {
      states.gameOn = false;
    },
    initRound() {
      states.sequence = [];
      states.playerTurn = false;
      states.currentStep = 0;
      states.numPlayerClicks = 0;
      states.correct = true;
      states.currentStepSequence = [];
    },
    setCorrect(bool) {
      states.correct = bool;
      console.log('setCorrect(), states.correct:', states.correct);
    },
    incrementClicks() {
      console.log('incrementClicks(), numPlayerClicks:', states.numPlayerClicks + 1);
      return states.numPlayerClicks++;      
    },
    addStep() {
      states.currentStep++;
      this.setCurrentStepSequence();
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
    },
    resetPlayerClicks() {
      console.log('resetPlayerClicks');
      return states.numPlayerClicks = 0;
    },
    resetStep() {
      states.currentStep = 0;
      return this.setCurrentStepSequence();
    },
    setCurrentStepSequence() {
      return states.currentStepSequence = states.sequence.slice(0, states.currentStep);
    }
  };

  // Computer functions
  let computer = {
    playSequence (i, arr) {
      if (arr[i]) {
          WEDGES.lightup(arr[i], SHORT_INTERVAL, null);
          setTimeout(function(){computer.playSequence(i+1, arr);}, SHORT_INTERVAL + 200);
      } else {
        console.log('sequence played, returning playerGo');
        return player.playerGo();
      }
    },
    addStepPlaySequence() {
      stateModifiers.addStep();
      console.log('currentStep incremented to', states.currentStep, states.currentStepSequence);
      this.playSequence(0, states.currentStepSequence);
    },  
  }
  
  function Round() {        
    //private methods
    /*let playerTurn = false,
    wrong = false,
    end = () => {
      console.log("round ended!");
    };*/
    //public methods
    this.start = () => {
      console.log("round started!");
      stateModifiers.initRound();
      stateModifiers.fillSequence();
      console.log('Round.sequence: ', states.sequence);
      console.log("states.gameOn, states.sequence, playerTurn",states.gameOn, states.sequence, states.playerTurn);
      computer.addStepPlaySequence();
      console.log('currentStepSequence', states.currentStepSequence);
      
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
      stateModifiers.turnGameOn();
      console.log('states.gameOn:', states.gameOn);    
      startRound();
    };
  }
}); // end DOMContentLoaded

