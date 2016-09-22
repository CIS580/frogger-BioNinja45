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
	ctx.strokeStyle = this.color;
	ctx.strokeRect(this.x, this.y, this.width, this.height);
}


