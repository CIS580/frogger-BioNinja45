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


