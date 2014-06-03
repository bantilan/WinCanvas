// JavaScript Document

/* define global */

(function(global){
	/*
	 * WinCanvas Functions
	 */
	
	function winCanvas(){
		this.msg = function(){
			alert(1);
		}
	}
	
	global.winCanvas = winCanvas;
}(this));




var test = new winCanvas();

test.msg();