document.addEventListener("DOMContentLoaded", function() {

  /* buttons */

  var start = document.getElementById('start');
  var strict = document.getElementById('strict')
  var strictIndicator = document.getElementById('strict-indicator');
  var strictOn = false;
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
    console.log("this.id", this.id);
    var id = this.id;
    var startButton = this;
    buttonDown(startButton);
    //timer then buttonup
    setInterval(function() {
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
    aiFinished: true,
    arr: [],
    count: 0,
    reset() {
      console.log("Game reset");
      this.arr = [];
      this.count = 0;
      return true;
    },
    random() {
      //generate a random number between 0 and 3;
      var rand = Math.round(Math.random() * 3);
      return rand;
    },
    lightUp(colour) {
      console.log("lightUp colour: ",colour);
      var wedge = document.getElementById(colour);
      wedge.classList.add('light');
      wedge.classList.remove('dark');
      setTimeout(function() {
        wedge.classList.add('dark');
        wedge.classList.remove('light');
      }, 1000);
    },
    start() {
      console.log("new game started!");
      this.gameStarted = true;
      this.aiTurn();
    },
    aiTurn() {
      this.fillArray();
    },
    fillArray() {
      if (this.count >= 0 && this.count <20) {
        var rand = this.random();
        console.log("rand from fillArray", rand);
        this.arr.push(rand);
        this.count++;
        console.log("count", this.count);
        console.log("arr length", this.arr.length);
        console.log("arr",this.arr);
      }
      this.displayMoves();
    },
    displayMoves() {
      var index = 0;
      var movesArray = this.arr;
      function nextWedge() {
        console.log("displayMoves WEDGES[this.arr[index]]:",WEDGES[movesArray[index]]);
        game.lightUp(WEDGES[movesArray[index]]);
        index++;
      }
      nextWedge();
      var glow = window.setInterval(function () {
        if (index >= movesArray.length) {
          clearTimeout(glow);
          playerTurn = true;
          return;
        }
        nextWedge();
      }, 750);
    },
    playerTurn() {
      console.log("it's the players's turn");
      return;
    }
  }

  function wedgeClick(e) {
    console.log(e.target.id + ' was clicked');
  }


});
