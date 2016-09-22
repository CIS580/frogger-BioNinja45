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
  ctx.strokeStyle = this.color;
	ctx.strokeRect(this.x, this.y, this.width, this.height);
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


