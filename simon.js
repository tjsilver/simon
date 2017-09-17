document.addEventListener("DOMContentLoaded", function () {

  /* buttons */
  var start = document.getElementById('start'),
  strict = document.getElementById('strict'),
  strictIndicator = document.getElementById('strict-indicator'), strictOn = false;

  /* global variables */
  var timeInterval = 1500;
  const WEDGES = ['green', 'red', 'blue', 'yellow'];

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
    if (game.reset()) {
      game.start();
    }
  }
  /* game */
  var game = {
    gameStarted: false,
    playerTurn: false,
    gameArr: [],
    playerArr: [],
    numSteps: 0,
    playerMoves: 0,
    timeListen: timeInterval * this.numSteps,
    reset() {
      console.log("Game reset");
      game.gameArr = [];
      game.playerArr = [];
      game.numSteps = 0;
      return true;
    },
    random() {
      //generate a random number between 0 and 3;
      var rand = Math.round(Math.random() * 3);
      return rand;
    },
    lightUp(colour) {
      console.log("*******lightUp() colour: ", colour);
      var wedge = document.getElementById(colour);
      wedge.classList.add('light');
      wedge.classList.remove('dark');
      setTimeout(function () {
        wedge.classList.add('dark');
        wedge.classList.remove('light');
      }, timeInterval);
    },
    start() {
      console.log("&&&&&&&& game.start()");
      this.gameStarted = true;
      setTimeout(game.aiTurn, timeInterval);
    },
    addToSequence() {
      console.log("*********game.addToSequence()")
      if (game.numSteps >= 0 && game.numSteps < 20) {
        var rand = game.random();
        console.log("rand from addToSequence", rand);
        game.gameArr.push(WEDGES[rand]);
        game.numSteps++;
        console.log("numSteps", game.numSteps);
        console.log("gameArr length", game.gameArr.length);
        console.log("gameArr", game.gameArr);
      }
      game.displayMoves();
    },
    displayMoves() {
      var i = 0;
      l = game.gameArr.length;
      (function loop() {
        console.log("game.gameArr[i]:", game.gameArr[i],'i:', i);
        game.lightUp(game.gameArr[i]);
        if (++i < l) {
          setTimeout(loop, timeInterval);
        } else {
            game.playerOn();
        }
      })(); // loop called immediately to start it off

    },
    playerOn() {
      console.log('****** playerOn()')
      game.playerTurn = true;
      console.log("game.playerTurn:", game.playerTurn);
      game.playerArr = [];
      startTiming();
    },
    playerOff() {
      console.log("playerOff!");
      game.playerTurn = false;
      console.log('game.playerTurn:', game.playerTurn);
    },
    aiTurn() {
      console.log("******* game.AiTurn()");
      game.addToSequence();
    },
    makePlayerMove(colour) {
      console.log("******makePlayerMove(),numSteps:", game.numSteps);
      game.playerArr.push(colour)
      console.log('game.playerArr:',game.playerArr)
      game.playerMoves++;
      console.log('game.playerMoves:', game.playerMoves);
      if (game.playerMoves == game.numSteps) {
        game.compare();
      }
    },
    //new compare
    compare() {
      console.log('*******compare()')
      for (let i=0; i<game.numSteps; i++) {
        if (game.gameArr[i] == game.playerArr[i]) {
          console.log('i:',i, 'is same');
        } else {
          console.log("i", i, "is different");
          console.log("start again");
          game.playerTurn = false;
          if (strictOn) {
            game.reset();
            game.start();
          } else {
            console.log('replay moves');
            // REPLAY MOVES
            setTimeout(game.displayMoves, timeInterval);
          }
          return;
        }
      }
      game.aiTurn();
    }
  }

  function startTiming() {
    console.log('-------startTiming()');
    // TODO: MAKE THIS WORK WITH ranOutOfTime!!
  }

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
  }

  function wedgeClick(e) {
    var w = e.target.id;
    console.log("wedgeClick():", w, 'was clicked');
    console.log("game.playerTurn is ", game.playerTurn)
    if (game.playerTurn == true && game.playerArr.length < game.numSteps) {
      game.makePlayerMove(w);
    } else {
      console.log('now turn for AI again');
    }
  }


});
/*
compare() {
    console.log('--------------Compare()')
  if (game.playerTurn == false) {
      for (var i = 0; i < game.gameArr.length; i++) {
      console.log('i:',i,'game',WEDGES[game.gameArr[i]], 'player', game.playerArr[i]);
      if (WEDGES[game.gameArr[i]] != game.playerArr[i]) {
        console.log("error")
        return;
          // SHOW SEQUENCE AGAIN OR START FROM SCRATCH
      }

    }
  }
  console.log("correct")
  game.fillArray();
  return;
    // MAKE ANOTHER GAME MOVE
}//end compare()
*/
//end new code
/*
game.playerArr.push(colour);
console.log('playerArr', game.playerArr)
game.lightUp(colour);
if (game.playerArr.length == game.numSteps) {
  game.playerTurn = false;
  console.log('no longer player turn')
  game.compare();
}
*/
