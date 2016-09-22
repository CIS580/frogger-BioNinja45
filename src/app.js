"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const Car = require('./car.js');
const EntityManager = require('./entity-manager');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var entities = new EntityManager(canvas.width,canvas.height,55);

var player = new Player({x: 0, y: 240});
entities.addEntity(player);
var cars = [];

var speed = 1;
var internalClock = 200;
var lives = 3;
var level = 1;
var gameOver=false;
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
	if(internalClock%200==0){
		var car = new Car({x:(Math.random()*400)+70,y:canvas.height},Math.floor((Math.random()*100)/25));
		cars.push(car);
		entities.addEntity(car);
		internalClock=0;
		var leftScreen = entities.cells[-1];
	
		leftScreen.forEach(function(entity){
		
			if(entity.id=="car"){
				
				for(i=0;i<cars.length;i++){
					if(cars[i]==entity){
						cars.splice(i,1);
					}
				}
			}
		});
	}
	entities.collide(function(entity1,entity2){
		if(entity1.id=="car" || entity2.id=="car"){
			lives-=1;
			if(lives==0){
				gameOver=true;
			}
			player.x=0;
			player.state = "idle";
		}
		else if (entity2.id=="log"){
			if(entity1.state=="idle"){
				entity1.y-=speed;
			}
		}
	});
	player.update(elapsedTime);
	entities.updateEntity(player);
	cars.forEach(function(car){
		car.update(elapsedTime,speed);
		entities.updateEntity(car);
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

	player.render(elapsedTime, ctx);
	//entities.renderCells(ctx);
}

