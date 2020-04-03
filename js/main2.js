"use strict";

{
  class Panel {
    constructor(game) {
      this.game = game;
      this.box3 = document.getElementById("box3");
      this.el = document.createElement("li");
      this.el.classList.add("pressed");
      this.el.addEventListener("click", ()=> {
        this.check();
      });
    }

    getEl() {
      return this.el;
    }

    activate(num) {
      this.el.classList.remove("pressed");
      this.el.textContent = num;
    }

    check() {
      if(this.game.getCurrentNum() === parseInt(this.el.textContent, 10)) {
        this.el.classList.add("pressed");
        this.game.addCurrentNum();
        if(this.game.getCurrentNum() === this.game.getLevel()**2+1) {
          clearTimeout(this.game.getTimeoutId());
          this.game.reverseStillPlaying();
          this.box3.classList.remove("hidden");
        }
      }
    }
  }




  class Board {
    constructor(game) {
      this.game = game;
      this.panels = [];
      for(let i=0; i<this.game.getLevel()**2; i++) {
        this.panels.push(new Panel(this.game));
      }
      this.setup();
    }

    setup() {
      const board = document.getElementById("board");
      this.panels.forEach(panel => {
        board.appendChild(panel.getEl());
      });
    }

    activate() {
      const nums = [];
      for(let i=1; i<=this.game.getLevel()**2; i++) {
        nums.push(i);
      }

      this.panels.forEach(panel => {
        const num = nums.splice(Math.floor(Math.random()*nums.length), 1)[0];
        panel.activate(num);
      });
    }
  }




  


  class Game {
    constructor(level) {
      this.level = level;
      this.timeLimit = level**2*1000;
      this.board = new Board(this);
    
      this.currentNum = undefined;
      this.startTime = undefined;
      this.timeoutId = undefined;
      this.stillPlaying = true;
      this.container = document.getElementById("container");
      // this.box1 = document.getElementById("box1");
      this.box2 = document.getElementById("box2");


      const btn = document.getElementById("btn");
      if(this.level==='1') {
        btn.textContent = "Go!";
      }
      btn.addEventListener("click", ()=> {
        this.start();
      });

      this.setup();
    }

    setup() {
      const container = document.getElementById("container");
      const PANEL_WIDTH = 40;
      const BOARD_PADDING = 6;
      container.style.width = PANEL_WIDTH*this.level + BOARD_PADDING*2 + "px";
    }

    start() {
      if(!this.stillPlaying) return;
      if(typeof this.timeoutId !== undefined) {
        clearTimeout(this.timeoutId);
      }

      this.currentNum = 1;
      this.board.activate();
      this.startTime = Date.now();
      this.runTimer();
    }

    runTimer() {
      const timer = document.getElementById("timer");
      let timeLeft = this.timeLimit - (Date.now()-this.startTime);
      if(timeLeft<=0) {
        this.currentNum = 0;
        this.stillPlaying = false;
        clearTimeout(this.timeoutId);
        timer.textContent = "0.00";
        this.box2.classList.remove("hidden");
        return;
      }

      timer.textContent = (timeLeft/1000).toFixed(2);
      this.timeoutId = setTimeout(()=> {
        this.runTimer();
      }, 10);
    }

    addCurrentNum() {
      this.currentNum++;
    }

    getCurrentNum() {
      return this.currentNum;
    }

    getTimeoutId() {
      return this.timeoutId;
    }

    getLevel() {
      return this.level;
    }

    reverseStillPlaying() {
      this.stillPlaying = false;
    }
  }


  class Setup {
    constructor() {
      this.minus = document.getElementById("minus");
      this.plus = document.getElementById("plus");
      this.ok = document.getElementById("ok");
      this.level = document.getElementById("level");
      this.container = document.getElementById("container");
      this.box1 = document.getElementById("box1");
    
      this.minus.addEventListener("click", ()=> {
        if(this.level.textContent==='1') return;
        this.level.textContent--;
      });
    
      this.plus.addEventListener("click", ()=> {
        if(this.level.textContent==='9') return;
        this.level.textContent++;
      });
    
      this.ok.addEventListener("click", ()=> {
        this.box1.classList.add("hidden");
        this.container.classList.remove("hidden");
        new Game(this.level.textContent);
      });
    }
  }



  new Setup();

}