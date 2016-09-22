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
			if(player.x>650 && player < 1020){
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

