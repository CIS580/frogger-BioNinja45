(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const Car = require('./car.js');
const EntityManager = require('./entity-manager');
const Log = require('./log.js');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var entities = new EntityManager(canvas.width,canvas.height,55);

var log = new Log()
var player = new Player({x: 0, y: 240});
entities.addEntity(player);
var cars = [];
var logs = [];
var speed = 1;
var internalClock = 200;
var lives = 3;
var level = 1;
var gameOver=false;
var onLog = false;
var logSpawnTime = 50;
var carSpawnTime = 200;
/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
	if(player.x>1136){
		level+=1;
		player.x=0;
		speed+=0.5;
		player.state="idle";
		logSpawnTime-=5;
		carSpawnTime-=10;
	}
	
	
	if(internalClock%logSpawnTime==0){
		var log = new Log((Math.random()*425)+670,canvas.height);
		logs.push(log);
		entities.addEntity(log);
	}
	if(internalClock%carSpawnTime==0){
		var car = new Car({x:(Math.random()*400)+70,y:canvas.height},Math.floor((Math.random()*100)/25));
		cars.push(car);
		entities.addEntity(car);
		internalClock=0;
		var leftScreen = entities.cells[-1];
		//delete entity if it has left screen every 200 time increments 
		leftScreen.forEach(function(entity){
			if(entity.id=="car"){
				for(i=0;i<cars.length;i++){
					if(cars[i]==entity){
						cars.splice(i,1);
					}
				}
			}
			else if(entity.id="log"){
				for(i=0;i<logs.length;i++){
					if(logs[i]==entity){
						logs.splice(i,1);
					}
				}
			}
		});
	}
	
	entities.collide(function(entity1,entity2){
		if(entity1.id=="car" || entity2.id=="car"){
			lives-=1;
			player.x=0;
			player.state = "idle";
		}
		else if (entity2.id=="log"){
			onLog = true;
		}
	});
	if(player.state=="idle"){
		if(onLog==true){
			player.y-=speed;
			onLog=false;
		}
		else{
			if(player.x>650 && player.x < 1020){
				lives-=1;
				player.x=0;
				player.state = "idle";
			}
		}
	}
	if(lives==0){
		gameOver=true;
	}
	player.update(elapsedTime);
	entities.updateEntity(player);
	cars.forEach(function(car){
		car.update(elapsedTime,speed);
		entities.updateEntity(car);
	});
	logs.forEach(function(log){
		log.update(elapsedTime,speed);
		entities.updateEntity(log);
	});
	internalClock+=1;
	// TODO: Update the game objects
}



/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeSt amp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
	
	if(gameOver==true){
		ctx.fillStyle = "black";
		ctx.font = "25px Arial";
		ctx.fillText("Level: " +level, 10,30);
		ctx.fillText("Lives: " +lives, 10,60);
		ctx.font = "75px Arial";
		ctx.fillText("GAME OVER", 370,200);
		ctx.font = "50px Arial";
		ctx.fillText("REFRESH BROWSER TO RESTART",200,300);
		return;
	}
	ctx.fillStyle = "lightblue";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "gray";
	ctx.fillRect(64, 0, canvas.width/2, canvas.height);
	ctx.fillStyle = "green";
	ctx.fillRect(0, 0, 64, canvas.height);
	ctx.fillRect(canvas.width/2-64, 0, 128, canvas.height);
	ctx.fillRect(1136, 0, 64, canvas.height);
	ctx.fillStyle = "black";
	ctx.font = "25px Arial";
	ctx.fillText("Level: " +level, 10,30);
	ctx.fillText("Lives: " +lives, 10,60);
	
	cars.forEach(function(car){
	  car.render(elapsedTime,ctx,car.color);
	});
	logs.forEach(function(log){
		log.render(elapsedTime,ctx);
	});

	player.render(elapsedTime, ctx);
	//entities.renderCells(ctx);
}


},{"./car.js":2,"./entity-manager":3,"./game.js":4,"./log.js":5,"./player.js":6}],2:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Car class
 */
module.exports = exports = Car;

/**
 * @constructor Car
 * Creates a new Car object
 * @param {Postition} position object specifying an x and y
 */
function Car(position, numberColor) {
  this.x = position.x;
  this.y = position.y;
  this.width  = 64;
  this.height = 128;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/cars_racer.svg');
  this.id="car";
  this.color = numberColor;
}

/**
 * @function updates the Car object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Car.prototype.update = function(time,speed) {
	this.y-=speed;
}

/**
 * @function renders the Car into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Car.prototype.render = function(time, ctx, whichCar) {

	ctx.drawImage(
	// image
		this.spritesheet,
		// source rectangle
		(this.color)*390 , 0, 220, 450,
		// destination rectangle
		this.x, this.y, this.width, this.height
	);
}



},{}],3:[function(require,module,exports){
module.exports = exports = EntityManager;

function EntityManager(width, height, cellSize) {
  this.cellSize = cellSize;
  this.widthInCells = Math.ceil(width / cellSize);
  this.heightInCells = Math.ceil(height / cellSize);
  this.cells = [];
  this.numberOfCells = this.widthInCells * this.heightInCells;
  for(var i = 0; i < this.numberOfCells; i++) {
    this.cells[i] = [];
  }
  this.cells[-1] = [];
}

function getIndex(x, y) {
  var x = Math.floor(x / this.cellSize);
  var y = Math.floor(y / this.cellSize);
  if(x < 0 ||
     x >= this.widthInCells ||
     y < 0 ||
     y >= this.heightInCells
  ) return -1;
  return y * this.widthInCells + x;
}

EntityManager.prototype.addEntity = function(entity){
  var index = getIndex.call(this, entity.x, entity.y);
  this.cells[index].push(entity);
  entity._cell = index;
}

EntityManager.prototype.updateEntity = function(entity){
  var index = getIndex.call(this, entity.x, entity.y);
  // If we moved to a new cell, remove from old and add to new
  if(index != entity._cell) {
    var cellIndex = this.cells[entity._cell].indexOf(entity);
    if(cellIndex != -1) this.cells[entity._cell].splice(cellIndex, 1);
    this.cells[index].push(entity);
    entity._cell = index;
  }
}

EntityManager.prototype.removeEntity = function(entity) {
  var cellIndex = this.cells[entity._cell].indexOf(entity);
  if(cellIndex != -1) this.cells[entity._cell].splice(cellIndex, 1);
  entity._cell = undefined;
}


EntityManager.prototype.collide = function(callback) {
  var self = this;
  this.cells.forEach(function(cell, i) {
    // test for collisions
    cell.forEach(function(entity1) {
      // check for collisions with cellmates
	  if(entity1.id=="player"){
		  cell.forEach(function(entity2) {
			if(entity1 != entity2) checkForCollision(entity1, entity2, callback);
				
			// check for collisions in cell to the right
			
			  self.cells[i+1].forEach(function(entity2) {
				checkForCollision(entity1, entity2, callback);
			  });
			
			
			// check for collisions in cell to the left
			
			  self.cells[i-1].forEach(function(entity2) {
				checkForCollision(entity1, entity2, callback);
			  });
			
			
			//check to see if need to check below
			if(self.numberOfCells - self.widthInCells>i){
			  // check for collisions in cell below
			
			  self.cells[i+self.widthInCells].forEach(function(entity2){
				checkForCollision(entity1, entity2, callback);
			  });
			  // check for collisions diagionally below and left
			
			  self.cells[i+self.widthInCells - 1].forEach(function(entity2){
				checkForCollision(entity1, entity2, callback);
			  });
			  // check for collisions diagionally below and right
			
			  self.cells[i+self.widthInCells + 1].forEach(function(entity2){
				checkForCollision(entity1, entity2, callback);
			  });
			  
			}
			//check to see if need to check above
			 if(self.widthInCells<i){
				 // check for collisions diagionally above and left
				  self.cells[i-self.widthInCells - 1].forEach(function(entity2){
					checkForCollision(entity1, entity2, callback);
				  });
				  // check for collisions diagionally above and right
				  self.cells[i-self.widthInCells + 1].forEach(function(entity2){
					checkForCollision(entity1, entity2, callback);
				  });
				  // check for collisions in cell above
				  self.cells[i-self.widthInCells].forEach(function(entity2){
					checkForCollision(entity1, entity2, callback);
				  });
			 }
			
			
			
		  });
		return;
	  }
    });
	
  });
}

function checkForCollision(entity1, entity2, callback) {
  var collides = !(entity1.x + entity1.width < entity2.x ||
                   entity1.x > entity2.x + entity2.width ||
                   entity1.y + entity1.height < entity2.y ||
                   entity1.y > entity2.y + entity2.height);
  if(collides) {
	  
    callback(entity1, entity2);
  }
}

EntityManager.prototype.renderCells = function(ctx) {
  for(var x = 0; x < this.widthInCells; x++) {
    for(var y = 0; y < this.heightInCells; y++) {
      ctx.strokeStyle = '#333333';
      ctx.strokeRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
	  
    }
  }
}

},{}],4:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],5:[function(require,module,exports){
//The bark was made by Bart K. retrieved from OpenGameArt at the following link: http://opengameart.org/content/seamless-tiling-tree-bark-texture

"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Log class
 */
module.exports = exports = Log;

/**
 * @constructor Log
 * Creates a new Log object
 * @param {Postition} position object specifying an x and y
 */
function Log(x,y) {
  this.x = x;
  this.y = y;
  this.width  = 50;
  this.height = 100;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/bark.png');
  this.id="log";
}

/**
 * @function updates the Log object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Log.prototype.update = function(time,speed) {
	this.y-=speed;
}

/**
 * @function renders the Log into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Log.prototype.render = function(time, ctx) {

	ctx.drawImage(
	// image
		this.spritesheet,
		// source rectangle
		0, 0, 220, 450,
		// destination rectangle
		this.x, this.y, this.width, this.height
	);
	ctx.strokeStyle = this.color;
	ctx.strokeRect(this.x, this.y, this.width, this.height);
}



},{}],6:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Player class
 */
module.exports = exports = Player;
var input = {
	up:false,
	down:false,
	jump:false
}
/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Player(position) {
  this.state = "idle";
  this.x = position.x;
  this.y = position.y;
  this.width  = 64;
  this.height = 64;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/PlayerSprite1.png');
  this.timer = 0;
  this.frame = 0;
  this.speed = 10;
  this.id = "player";
  
  //window.onmousedown = function(event) {
  //  if(self.state == "idle") {
  //    self.state = "jumping";
  //  }
  //}
}

/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function(time) {
  var self=this;
  if(input.jump==true) self.state="jumping";
  switch(this.state) {
    case "idle":
      this.timer += time;
      if(this.timer > MS_PER_FRAME) {
        this.timer = 0;
        this.frame += 1;
        if(this.frame > 3) this.frame = 0;
      }
	  if(input.up){
		  if(this.y > 5) this.y-=2;
	  }
	  else if (input.down)
	  {
		  if(this.y < 420) this.y+=2;
	  }	
	  
      break;
    // TODO: Implement your player's update by state
	case "jumping":
		this.timer+=time;
		if(this.timer > MS_PER_FRAME){
			this.x += this.speed;
			this.timer=0;
			this.frame+=1;
			if(this.frame>8){
				this.frame=0;
				this.state="idle";
			}
		}
		break;
		
  }
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Player.prototype.render = function(time, ctx) {
  switch(this.state) {
    case "idle":
      ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
        this.frame * 64, 64, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.width, this.height
      );
      break;
    // TODO: Implement your player's redering according to state
	case "jumping":
		ctx.drawImage(
			// image
			this.spritesheet,
			// source rectangle
			Math.floor(this.frame/4)*64, 0, this.width, this.height,
			// destination rectangle
			this.x, this.y, this.width, this.height
		  );
		  break;
  }
}

window.onkeydown = function(event)
{
	event.preventDefault();
	if(this.state="idle"){
		switch(event.keyCode)
		{
			 case 32:
				input.jump = true;
				break;			
			 case 38:
			 case 87:
				input.up = true;
				break;
			 case 40:
			 case 83:
				input.down = true;
				break;

		}
	}
}
window.onkeyup = function(event)
{
	event.preventDefault();
	switch(event.keyCode)
	{
		case 32:
			input.jump = false;
			break;
		 case 38:
		 case 87:
			input.up = false;
			break;

		 case 40:
		 case 83:
			input.down = false;
			break;

	}
}



},{}]},{},[1]);
