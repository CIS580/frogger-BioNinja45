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
function Log(position) {
  this.x = position.x;
  this.y = position.y;
  this.width  = 64;
  this.height = 128;
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


