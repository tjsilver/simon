document.addEventListener("DOMContentLoaded", function () {

  /* buttons */

  var start = document.getElementById('start');
  var strict = document.getElementById('strict')
  var strictIndicator = document.getElementById('strict-indicator');
  var strictOn = false;
  var timeInterval = 1000;
  const WEDGES = ['green', 'red', 'blue', 'yellow'];

  start.addEventListener('click', startPress, false);
  strict.addEventListener('click', useStrict, false);
  for (let i = 0; i < WEDGES.length; i++) {
    document.getElementById(WEDGES[i]).addEventListener('click', wedgeClick, false);
  }

  function buttonDown(el) {
    el.classList.add('pressed');
  }

  function buttonUp(el) {
    el.classList.remove('pressed');
  }

  function startPress() {
    console.log("*******startPress with this.id", this.id);
    var id = this.id;
    var startButton = this;
    buttonDown(startButton);
    //timer then buttonup
    setTimeout(function () {
      buttonUp(startButton);
    }, 500);
    if (game.reset()) {
      game.start();
    }
  }

  function useStrict() {
    var strictButton = this;
    if (!strictOn) {
      buttonDown(strictButton);
      strictIndicator.classList.add('on');
      strictOn = true;
    } else {
      buttonUp(strictButton);
      strictIndicator.classList.remove('on');
      strictOn = false;
    }
  }

  function indicatorOff() {
    strictIndicator.classList.remove('on');
  }

  var game = {
    gameStarted: false,
    playerTurn: false,
    gameArr: [],
    playerArr: [],
    count: 0,
    timeListen: this.timeInterval * this.count,
    reset() {
      console.log("Game reset");
      this.gameArr = [];
      this.count = 0;
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
      this.aiTurn();
    },
    fillArray() {
      console.log("*********game.fillArray()")
      if (this.count >= 0 && this.count < 20) {
        var rand = this.random();
        console.log("rand from fillArray", rand);
        this.gameArr.push(rand);
        this.count++;
        console.log("count", this.count);
        console.log("gameArr length", this.gameArr.length);
        console.log("gameArr", this.gameArr);
      }
      this.displayMoves();
    },
    displayMoves() {
      var i = 0;
      l = game.gameArr.length;
      (function loop() {
        console.log("game.gameArr[i]:", game.gameArr[i],'i:', i);
        game.lightUp(WEDGES[game.gameArr[i]]);
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
    },
    aiTurn() {
      console.log("******* game.AiTurn()")
      game.fillArray();
    //  game.playerTurn = false;
    },
    makePlayerMove(colour) {
      console.log("******makePlayerMove(),count:", game.count);
      game.playerArr.push(colour);
      console.log('playerArr', game.playerArr)
      game.lightUp(colour);
      if (game.playerArr.length == game.count) {
        game.playerTurn = false;
        console.log('no longer player turn')
        game.compare();
      }
    },
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
    }
  }

  function wedgeClick(e) {
    var w = e.target.id;
    console.log("wedgeClick():", w, 'was clicked');
    console.log("game.playerTurn is ", game.playerTurn)
    if (game.playerTurn == true && game.playerArr.length < game.count) {
      game.makePlayerMove(w)
    } else {
      console.log('now turn for AI again')
    }
  }


});
