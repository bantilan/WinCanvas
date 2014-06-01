/* Create the object */
function Shape(o){
	this.img = o.img;
	this.w = o.w;
	this.h = o.h;
	this.y = o.y;
	this.stat = o.stat;
	this.x = o.x;
	this.text = o.text;
	this.elementType = (o.text!=undefined) ? "text" : "shape"
	this.draggable=false;
	this.autoFit = (o.autoFit==undefined) ? false : o.autoFit; 
	this.ox = 0;
	this.oy = 0;
	this.depth = 0;
	this.textHeight = 0;
	this.fy = 0;
	this.f = 0;
	this.fx = 0;
	this.alpha = 0;
	this.hover = false;
	this.initAnimate = false;
	this.velocty = 0;
	this.fontSize = (o.fontSize==undefined) ? 18 : o.fontSize;
	this.font = (o.font==undefined) ? "Arial" : o.font;
	this.lineHeight = (o.lineHeight==undefined) ? this.fontSize : o.lineHeight;
	this.color = o.color;
	this.align = (o.align==undefined) ? "left" : o.align;
	this.valign = (o.valign==undefined) ? "top" : o.valign;
	this.xscale = 100;
	this.yscale = 100;
	this.setHandCursor = true;
	this.currentFrame = 0;
	this.shadowColor = o.shadowColor;
	this.shadowOffsetX = o.shadowOffsetX;
	this.shadowOffsetY = o.shadowOffsetY;
	this.shadowBlur = o.shadowBlur;
	this.maxFrame = o.maxFrame;
	this.sy = 0;
	this.sx = 0;
	this.deleteClip = false;
	this.visible = true;
	this.type = "";
	if(this.elementType=="text"){
		this.sy = 100;


	}
}
/*Create the scrollable Text on the Canvas */
Shape.prototype.multiText = function(){
	this.scrollStart = false;
	this.sy = 100;
	this.scrollY = 0;
	this.scrollOldY = 0;
	this.scrollOldSy = 0;
	this.scrollDown = true;
	this.scrollAcc = 0;
	this.pullUp = false;
	this.scrollDrag = false;
	this.touchTime = 0;

	//alert(this.img);
	this.clickCallback = function(){
		this.touchTime = 0;
		this.scrollStart = true;
		this.scrollOldY = this.mouseY;
		this.scrollDrag = true;
		this.scrollOldSy = this.sy;
		//alert(this.h+":"+this.img.maxHeight);	
	}
	
	this.enterFrameScroll = function(){
		this.touchTime++;

		if(this.img.maxHeight>this.h && this.adjustvisible==true && this.adjustw+this.adjustx>=0){
			this.root.ctx.beginPath();
			this.root.ctx.lineWidth = 6;
			this.root.ctx.lineCap = 'round';
			this.root.ctx.strokeStyle = this.color;
			
			this.root.ctx.globalAlpha = (this.adjustalpha)*.5;
			
			
			var scrollSizePercent = (this.h/this.img.maxHeight)*100;
			var scrollYPercent = ((this.sy-100)/this.img.maxHeight)*100;
			
			
			if(scrollYPercent<0){ 
				scrollSizePercent = scrollSizePercent+scrollYPercent;
				scrollYPercent = 0;
			}
			if(scrollYPercent>100-scrollSizePercent){ 
				scrollSizePercent = (scrollYPercent-(100-scrollSizePercent))-scrollSizePercent;
				scrollYPercent = 100;
			}
			
			scrollSize = this.adjusth*(scrollSizePercent/100);
			scrollY = this.adjusth*(scrollYPercent/100);
			
			this.root.ctx.moveTo(this.adjustx+this.adjustw+6,this.adjusty+scrollY); // line 1
			this.root.ctx.lineTo(this.adjustx+this.adjustw+6,this.adjusty+scrollY+(scrollSize)); // line 1
			this.root.ctx.lineJoin = "miter";
			this.root.ctx.stroke();
		}
		//for hover before
		if(this.img.maxHeight>this.h && this.adjustvisible==true && this.adjustw+this.adjustx>=0){
			if(this.scrollStart==true){
				this.scrollDecay = ((this.scrollOldY - this.mouseY)/20);
				this.scrollAcc = this.scrollDecay ;
				this.animateScroll = function(){
					if(this.scrollDrag==true){
						var newSy = Math.round(this.scrollOldY-this.mouseY)+this.scrollOldSy;
						if(newSy>100){
							this.sy = newSy;
						}
						if(newSy<100){
							this.sy = 100;	
						}
						if(newSy>=this.img.maxHeight-(this.h-110)){
							this.sy = this.img.maxHeight-(this.h-110);
						}
						
						
					}else{		
						var newSy = this.sy+this.scrollAcc;			
						if(newSy>100){
							this.sy = newSy;
						}
						if(newSy<100){
							this.sy = 100;	
						}
						//alert(this.w-100);
						if(newSy>=this.img.maxHeight-(this.h-110)){
							this.scrollAcc = 0;
							this.sy = this.img.maxHeight-(this.h-110);
							this.textHeight = 500;
						}
						this.scrollAcc = this.scrollAcc;
						this.scrollAcc *= 0.98;
						//this.sy += this.scrollAcc;	
						
					}
				
				}
				
			}
		}else{
			this.sy = 100;	
		}
	}
	this.overCallback = function(){
		
	}
	this.releaseCallback = function(){
		this.scrollDrag = false;
		this.scrollStart = false;
	}
}
/* Function for playing specific frame from sprite */
Shape.prototype.gotoAndPlay = function(frame){
	this.stat = "play";
	this.f = 0;
	this.fx = 0;
	this.fy = 0;
	for(i=0;i<frame;i++){
		this.sx = this.w*this.fx;
		this.sy = this.h*this.fy;
		if(this.fx*this.w<=this.img.width-(this.w*2)){
			this.fx++;
		}else{
			this.fx=0;
			this.fy++;	
		}
	}
	this.currentFrame = frame;
}
/* Function for jumping to specific frame from sprite */
Shape.prototype.gotoAndStop = function(frame){
	this.stat = "stop";
	this.f = 0;
	this.fx = 0;
	this.fy = 0;
	for(i=0;i<frame;i++){
		this.sx = this.w*this.fx;
		this.sy = this.h*this.fy;
		if(this.fx*this.w<=this.img.width-(this.w*2)){
			this.fx++;
		}else{
			this.fx=0;
			this.fy++;	
		}
	}
	this.currentFrame = frame;
}
/* Play the object from the current frame */
Shape.prototype.play = function(callback){
	this.stat = "play";
}
/* Stop the object from the current frame */
Shape.prototype.stop = function(callback){
	this.stat = "stop";
}
/* When user click the object, it started to Drag and follow the mouse cursor */
Shape.prototype.startDrag = function(callback){
	this.draggable=true;
}
/* Stop Dragging object when mouse release */
Shape.prototype.stopDrag = function(callback){
	this.draggable=false;
}
/* Function when mouse is press in the object */
Shape.prototype.onClick = function(callback){
	this.clickCallback = callback;
}
/* Function when mouse is release in the object */
Shape.prototype.onRelease = function(callback){
	this.releaseCallback = callback;
}
/* Function when mouse is rollover in the object */
Shape.prototype.onRollOver = function(callback){
	this.overCallback = callback;
}
/* Function when mouse is rollout in the object */
Shape.prototype.onRollOut = function(callback){
	this.outCallback = callback;
}
/* Always play this function when the object is alive */
Shape.prototype.onEnterFrame = function(callback){
	this.frameCallback = callback;
}
/* Remove the object */
Shape.prototype.removeMovieClip = function(callback){
	this.deleteClip = true;	
}
/* Remove the onEnterFrame Function */
Shape.prototype.removeEnterFrame = function(callback){
	this.frameCallback = undefined;
}
/* Set the Depth of the object */
Shape.prototype.setDepth = function(val){
	this.depth = val;
}
/* Add an object in a object */
Shape.prototype.addChild = function(a){
	var myState = this.root;
	a.parent = this;
	a.root = this.root;
	myState.img.push(a);
	myState.img[myState.img.length-1].f = 0;
	myState.img[myState.img.length-1].depth = myState.img.length-1;
	myState.img[myState.img.length-1].alpha = 100;
	myState.valid = false;
}
/* Animate an object to X and Y destination */
Shape.prototype.animate = function(type,x1,x2,friction,callback){
	this[type+"init"] = false;
	this[type+"velocity"] = 0;
	this[type+"destination"] = 0;
	this[type+"alias"] = 0;
	this[type+"AnimateCallbackFinish"] = callback;
	this[type+"AnimateCallback"] = function(){
		
		if(friction==undefined)	friction = 0.95;
		if(this[type+"init"] == false){
			//this[type] = x1;
			this[type+"alias"] = x1;
			this[type+"destination"] = ((x1-x2)<0) ? -(x1-x2) : x1-x2;
			
			this[type+"velocity"] = this[type+"destination"] / ( friction * ( 1 / (1-friction ) ) );
			this[type+"init"] = true;
		}
	
		this[type+"velocity"] *= friction;
		
		if(x1<x2){
			this[type+"alias"] += this[type+"velocity"];
			//this[type] += this[type+"velocity"];
		}else{
			this[type+"alias"] -= this[type+"velocity"];
			//this[type] -= this[type+"velocity"];
		}
		this[type+"alias"] = Math.round(this[type+"alias"]*Math.pow(10,2))/Math.pow(10,2);
		this[type] = Math.round(this[type+"alias"]);
		//alert(this[type+"destination"]+":"+Math.round(this[type]));

		if(x2==Math.round(this[type+"alias"])){
			//alert(1);
			//alert(type+":"+x2);
			//this[type+"AnimateFinish"]();
			this[type] = x2;
			if(this[type+"AnimateCallbackFinish"]!=null) this[type+"AnimateCallbackFinish"]();
			this[type+"AnimateCallback"] = null;
			
		}
	}
}
/* When the object collision each other */
function hitTest(obj1,obj2){
	
	adjustx = (obj1.parent==undefined) ? obj1.x : obj1.adjustx;
	adjusty = (obj1.parent==undefined) ? obj1.y : obj1.adjusty;
	adjustxscale = (obj1.parent==undefined) ? ((obj1.xscale*obj1.w)/100) : obj1.adjustw;
	adjustyscale = (obj1.parent==undefined) ? ((obj1.yscale*obj1.h)/100) : obj1.adjusth;
	
	
	
	return  (adjustx <= obj2.x) && (adjustx + adjustxscale >= obj2.x) &&
	  (adjusty <= obj2.y) && (adjusty + adjustyscale >= obj2.y);	
	
	/*
	adjustx = obj1.adjustx;
	adjusty = obj1.adjusty;
	adjustw = obj1.adjustw;
	adjusth = obj1.adjusth;
	*/
	//alert(obj1.parent);
	return  (adjustx <= obj2.x) && (adjustx + adjusth >= obj2.x) &&
	  (adjusty <= obj2.y) && (adjusty + adjusth >= obj2.y);	
	
	
	/*return  (adjustx + parentx <= obj2.x) && (adjustx + adjustxscale + parentx >= obj2.x) &&
	  (adjusty + parenty <= obj2.y) && (adjusty + parenty + adjustyscale >= obj2.y);	*/
}	
/* Initialize the Canvas */
function movieCanvas(canvas){
	
	var myState = this;
	var myCanvas = canvas;
	var trackX = 0;
	var trackY = 0;
	var touchPhone = false;
	this.visible = true;
	this.canvas = canvas;
	this.width = canvas.width;
	this.height = canvas.height;
	this.ctx = canvas.getContext('2d');
	this.myfps = 0;
	this.fpsFilter = 50;
	this.lastUpdate = (new Date)*1 - 1;
	this.now = (new Date)*1 - 1;
	
	this.interval;
	
	if (window.Touch){
		if(navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i)){
			
			this.touchPhone = true;
			this.fullScreen = true;
			this.eventType = ["touchstart","touchend","touchmove"];
		}else{
			
			this.touchPhone = true;
			this.fullScreen = false;
			this.eventType = ["mousedown","mouseup","mousemove"];
		}
	}else{
		if(navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i)){
			
			this.touchPhone = true;
			this.fullScreen = true;
			this.eventType = ["touchstart","touchend","touchmove"];
		}else{
			this.touchPhone = false;
			this.fullScreen = false;
			this.eventType = ["mousedown","mouseup","mousemove"];
		}
	}
	touchPhone = this.touchPhone;
	this.linkList = [];
	this.linkCreate = [];
	this.img = [];
	this.fps = 20;
	this.setCursor;
	this.setHandCursor;
	this.draggable = false;
	this.textFillCounter = 0;
	this.draw = function(){	
		if(this.visible==true){
			this.clear();
			
			myState.img.sort(function(a, b){return a.depth-b.depth});
			
			//document.getElementById("trace").innerHTML = "";
			for(var i=0;i<myState.img.length;i++){
				// just to refresh our depth
				if(myState.img[i].deleteClip==true){
					myState.img.splice(i,1);
				}
				
				
				myState.img[i].depth = i;
				
				img = myState.img[i];
				
				if(img.img!=null){
					if(img.w==null) img.w = img.img.width;
					if(img.h==null) img.h = img.img.height;
					if(img.w>img.img.width) img.w = img.img.width;
					if(img.h>img.img.height) img.h = img.img.height;
				}
				
				
				
				if(img.stat=="play" && img.img!=null){
					img.currentFrame = Math.floor(((img.fy+1)*(img.img.width/img.w))-(img.img.width/img.w)+(img.fx+1));
					
					//document.getElementById("trace").innerHTML += "fx="+img.fx+" | fy="+img.fy+" | x="+img.x+" | y="+img.y+" | f="+img.f+" | maxFrame="+img.maxFrame+" | currentFrame="+img.currentFrame+"<br/>";
					img.f++;
					img.sx = img.w*img.fx;
					img.sy = img.h*img.fy;
					if(img.fx*img.w<=img.img.width-(img.w*2)){
						img.fx++;
					}else{
						img.fx=0;
						img.fy++;	
					}
					if(img.currentFrame>=img.maxFrame){
						img.fx=0;
						img.fy=0;
						img.f=0;
					}
					

				}else if(this.stat=="stop"){
					//img.f=1;
					//img.sx = img.w*img.fx;
					//img.sy = img.h*img.fy;
					//img.sx = 0;
					//img.sy = 0;
				}else{
					
				}

				//alpha = (img.parent==undefined) ? img.alpha/100 : (img.alpha/(100/img.parent.alpha))/100;
				
				if(img.frameCallback!=null){
					img.frameCallback();
				}
				
				if(img.alphaAnimateCallback!=null){
					img.alphaAnimateCallback();	
				}
				
				if(img.wAnimateCallback!=null){
					img.wAnimateCallback();	
				}
				

				
				if(img.xAnimateCallback!=null){
					img.xAnimateCallback();	
				}
				
				if(img.yAnimateCallback!=null){
					img.yAnimateCallback();	
				}
				
				if(img.sxAnimateCallback!=null){
					img.sxAnimateCallback();	
				}
				
				if(img.syAnimateCallback!=null){
					img.syAnimateCallback();	
				}
				
				if(img.xscaleAnimateCallback!=null){
					img.xscaleAnimateCallback();	
				}
				
				if(img.yscaleAnimateCallback!=null){
					img.yscaleAnimateCallback();	
				}
				
				
				alpha = img.alpha/100;
				
				visible = (img.parent==undefined) ? img.visible : img.parent.visible;
				
				
				yscale = (img.yscale*img.h)/100;
				xscale = (img.xscale*img.w)/100;
				//img.xscaleadjust = xscale;
				//img.yscaleadjust = yscale;
				//Let's set Default Values, If Object is NULL..
				
				if(img.w==undefined && img.img!=null) img.w = img.img.width;
				if(img.h==undefined && img.img!=null) img.h = img.img.height;

				
				if(img.x==undefined) img.x = 0;
				if(img.y==undefined) img.y = 0;
				
				drawx = img.x;
				drawy = img.y;

				
				if(img.parent!=undefined){
					var thisobject = img;
					totalxscale = 0;
					totalobject = 1;
					totalxscale = thisobject.xscale;
					totalyscale = thisobject.yscale;
					totalalpha = thisobject.alpha;
					totalvisible = thisobject.visible;
					totalx = thisobject.x;
					totaly = thisobject.y;
					
					while(thisobject.parent!=undefined){
						totalvisible = (thisobject.parent.visible==false) ? false : totalvisible;
						totaly = totaly/(100/thisobject.parent.yscale)+thisobject.parent.y;
						totalx = totalx/(100/thisobject.parent.xscale)+thisobject.parent.x;
						totalalpha = totalalpha/(100/thisobject.parent.alpha);
						totalxscale = totalxscale/(100/thisobject.parent.xscale);
						totalyscale = totalyscale/(100/thisobject.parent.yscale);
						
						thisobject = thisobject.parent;
						
						totalobject++;
					}
					//boxLogo.x;

					//thisobject.x = totalx;
					//totalx += thisobject.x;
					
					//alert(totalx);
					
					drawx = totalx;
					drawy = totaly;
					visible = totalvisible;
					alpha = totalalpha/100;
					//drawx = (totalx/(100/totalxscale));
					
					//drawx = totalx/totalobject;
					yscale = (totalyscale*img.h)/100;
					xscale = (totalxscale*img.w)/100;
					

					
				}
				
				img.adjustalpha = alpha;
				img.adjustvisible = visible;
				img.adjusty = drawy;
				img.adjustx = drawx;
				img.adjusth = yscale;
				img.adjustw = xscale;
				//alert(drawx);
				myState.ctx.globalAlpha = alpha;
				


				if(img.text!=undefined){

					myState.img[i].multiText();
					myState.img[i].img = myState.multiFillText(img.text, img.x, img.y,img.lineHeight,img.w,img.fontSize,img.font,img.color,img.align,img.h,img.autoFit,img.valign,img.shadowColor,img.shadowOffsetX,img.shadowOffsetY,img.shadowBlur);
					//alert(img.text+":"+img.shadowColor);
					//myState.img[i].img = myState.drawRect(200, 200, 20, 20, '#ffffff', '#ffffff')
					myState.img[i].text = undefined;
					//alert(myState.img[i].h);
					//myState.ctx.fillText(img.text, img.x, img.y);
					//alert(myState.img[i].img);
				}else{
					
					//if(myState.linkCreate.length!=0){
					
						for(var lb=0;lb<myState.linkCreate.length;lb++){
							//alert(img.img ==myState.linkCreate[lb].img);
							if(img.img==myState.linkCreate[lb].img){
								
								
								//alert(myState.linkCreate[ll].img);
								//alert(myState.linkCreate[ll].w);
								//alert(myState.linkList[0].href);
								//var hrefStr = myState.linkList[0].href;
								//myState.linkList = [];
								
								myState.linkList.push("bb");
								lw = myState.linkCreate[lb].w;
								lx = myState.linkCreate[lb].x;
								li = myState.linkList.length-1;
								//alert(img.y);
								//linkList.push(1); width, height, radius, size, fill, stroke, alpha
								img.parent.addChild(myState.linkList[li] = new Shape({img:myState.drawLink(lw,20,0,1,'#293f07', '#293f07'),w:720,h:20,x:img.x+lx,y:img.y,stat:"stop"}));
								//img.parent.addChild(myState.linkList[li] = new Shape({img:myState.drawRect(20,20,20,10,'#ffffff', '#ffffff'),w:720,h:20,x:20,y:20,stat:"stop"}));
								myState.linkList[li].ly = myState.linkCreate[lb].y;
								myState.linkList[li].whoImg = img;
								myState.linkList[li].alpha = 0;
								myState.linkList[li].myImg = myState.linkCreate[lb].img;
								//myState.linkList[li].id = myState.img.length;
								//eeCCBB.href = hrefStr;
								//alert(22);
								myState.linkList[li].onClick(function(){
									
								});
								//alert(li);
								myState.linkList[li].root = myState;
								myState.linkList[li].type = "link";
								myState.linkList[li].href = myState.linkCreate[lb].href;
								myState.linkList[li].target = myState.linkCreate[lb].target;
								myState.linkList[li].conn = myState.linkCreate[lb].conn;
								//myState.linkList[li].linkCom = [];
								//alert(myState.linkCreate[lb].href);
								/*
								fCom = lb+1;
								try{
									// Let's find checks if links on the next line are connected to this link...
									while(myState.linkCreate[fCom].conn == myState.linkCreate[lb].conn){
										myState.linkList[fCom].linkCom.push(myState.linkCreate[fCom]);
										myState.linkList[li].linkCom.push(myState.linkCreate[fCom]);
										//alert("FOUND");
										fCom++;
									}
								}catch(e){}
								*/

								
								//myState.linkList[li].depth = (img.depth+1);
								myState.linkList[li].onEnterFrame(function(){
									//document.getElementById("trace").innerHTML += this.depth+"<br/>";
									if(this.myImg!=this.whoImg.img){
										//this.root.img.splice(this.id,1);
										//this.visible=false; // temporary not visible.. Need to edit.. we need to remove those resources..
										this.removeMovieClip();
										//this.removeEnterFrame();
									}
									//alert(1);
									//this.root.img.splice(this.id,1);
									//this.removeEnterFrame();
									
							//	alert(this.whoImg.sy);
									//document.getElementById("trace").innerHTML = this.ly+"<br/>"+this.whoImg.sy+"<br/>"+this.parent.y+"<br/>"+this.whoImg.y;
									this.y = this.whoImg.y+this.ly-(this.whoImg.sy-100)+3;
									//this.y = -((this.whoImg.sy-180-this.ly-this.whoImg.y));
									//this.alpha = this.whoImg.alpha;
									//this.visible = this.whoImg.visible;
								});
								
								//myState.linkCreate[ll].img = null;
								//
								//width, height, radius, size, fill, stroke, alpha);
								//myState.img.push(myState.drawRect(200, 200, 20, 20, '#ffffff', '#ffffff',1));
								//if(lb==myState.linkCreate.length) myState.linkCreate = [];
								
								//img.parent.alpha = 50;
								//alert(lb+":"+myState.linkCreate.length);
								myState.linkCreate.splice(lb,1);
							}//myState.img.push(myState.drawRect(200, 200, 20, 20, '#ffffff', '#ffffff'));
							
						}
						//if(foundLink==true){
							///myState.linkCreate = [];
						//}
						
						//
						//..alert(myState.linkList[0]);	
					//}
					
					if(img.img==undefined || img.img==null || visible==false || img.visible==false){
						
					}else{


						if(img.elementType=="text"){
							if(img.img.maxHeight>img.h){
								
							}else{
								img.clickCallback = undefined;
								img.overCallback = undefined;
								img.releaseCallback = undefined;
							}
						}
						//alert(img.h);
						myState.ctx.drawImage(img.img,img.sx, img.sy, img.w, img.h, drawx, drawy, xscale, yscale);
						//myState.ctx.drawImage(img.img,img.sx, img.sy, img.w, img.h, img.x, img.y, img.w, img.h);

					}

				}
				// To fixed Delay Problem
				if(img.animateScroll!=null){
					img.animateScroll();
				}
				if(img.enterFrameScroll!=null){
					img.enterFrameScroll();
				}

			}
			

			if(this.fullScreen==true){
				/*
				if(window.innerHeight > window.innerWidth){
					$("#game").width(window.innerWidth);
				}else{
					$("#game").width(window.innerWidth);
				}
				*/
			}
		}
		this.now=new Date;
		var thisFrameFPS = 1000 / ((this.now) - this.lastUpdate);
		this.myfps += (thisFrameFPS - this.myfps) / this.fpsFilter;
		this.lastUpdate = this.now;
		if(this.myfps>32){
			myState.fps++;
			clearTimeout(myState.interval);
			myState.interval = setInterval(function() { myState.draw(); }, myState.fps);
		}
		//document.getElementById("trace").innerHTML = this.myfps+":"+this.fps;
		
		//alert(thisFrameFPS - this.myfps);
	}
	canvas.addEventListener(this.eventType[0],function(e){

		var mouse = myState.getMouse(e);
		
		//alert(e.touches[0].clientY + ":" + e.touches[0].clientX);
		var mx;
		var my;
		try{
			mx = trackX = (touchPhone==true) ? e.touches[0].pageX : mouse.x;
			my = trackY = (touchPhone==true) ? e.touches[0].pageY : mouse.y;
		}catch(e){
			mx = trackX = mouse.x;
			my = trackY = mouse.y;
		}
		var img = myState.img;
		var highestDepth = 0;
		var indexHighestDepth = 0;

		for(var i=0;i<img.length;i++){
			if(img[i].type=="link"){
				if(hitTest(img[i].whoImg,{x:mx,y:my})){
					if(hitTest(img[i],{x:mx,y:my})){
						visible = (img[i].whoImg.parent==undefined) ? img[i].whoImg.visible : img[i].whoImg.adjustvisible;
						//clickCallback = (img[i].whoImg.parent==undefined) ? img[i].whoImg.clickCallback : img[i].whoImg.clickCallback;
						if(highestDepth<=img[i].whoImg.depth && visible!=false && img[i].whoImg.visible!=false){
							//document.location = img[i].href;	
						}
					}
				}
			}else{
				if(hitTest(img[i],{x:mx,y:my})){
					
					visible = (img[i].parent==undefined) ? img[i].visible : img[i].adjustvisible;
					
					clickCallback = (img[i].parent==undefined) ? img[i].clickCallback : img[i].clickCallback;
					
					if(highestDepth<=img[i].depth && clickCallback!=undefined && visible!=false && img[i].clickCallback!=undefined && img[i].visible!=false){
						
						highestDepth = img[i].depth;
						myState.img[i].ox = mx-img[i].x;
						myState.img[i].oy = my-img[i].y;
						myState.img[i].mouseX = mx;
						myState.img[i].mouseY = my;

						indexHighestDepth = i;
					}
				}
			}

		}
		try{
			img[indexHighestDepth].clickCallback();
		}catch(e){}
	},true);
	canvas.addEventListener(this.eventType[1],function(e){
		//alert(trackX);
		//var mouse = myState.getMouse(e,1);
		
		
		var mx = trackX;//(mouse.x==0) ? e.touches[0].pageX : mouse.x;
		var my = trackY;//(mouse.y==0) ? e.touches[0].pageY : mouse.y;
		
		
		
		var img = myState.img;
		var highestDepth = 0;
		var indexHighestDepth = 0;
		for(var i=0;i<img.length;i++){
			if(img[i].type=="link"){
				if(hitTest(img[i].whoImg,{x:mx,y:my})){
					if(hitTest(img[i],{x:mx,y:my})){
						visible = (img[i].whoImg.parent==undefined) ? img[i].whoImg.visible : img[i].whoImg.adjustvisible;
						//clickCallback = (img[i].whoImg.parent==undefined) ? img[i].whoImg.clickCallback : img[i].whoImg.clickCallback;
						if(highestDepth<=img[i].whoImg.depth && visible!=false && img[i].whoImg.visible!=false){
							
							if(img[i].target=="_blank"){
								window.open(img[i].href,'_blank');	
							}else{
								document.location = img[i].href;
							}
						}
					}
				}
			}else{
				if(hitTest(img[i],{x:mx,y:my})){
					
					visible = (img[i].parent==undefined) ? img[i].visible : img[i].adjustvisible;
					releaseCallback = (img[i].parent==undefined) ? img[i].releaseCallback : img[i].releaseCallback;
					// Let's put it back  && releaseCallback!=undefined
					if(highestDepth<=img[i].depth && visible!=false && img[i].visible!=false && img[i].releaseCallback!=undefined){
						
						highestDepth = img[i].depth;
						myState.img[i].ox = mx-img[i].x;
						myState.img[i].oy = my-img[i].y;
						myState.img[i].mouseX = mx;
						myState.img[i].mouseY = my;

						indexHighestDepth = i;
					}
				}
			}

		}
		
		try{
			img[indexHighestDepth].releaseCallback();
		}catch(e){}
	},true);
	canvas.addEventListener(this.eventType[2], function(e) {
		
		var mouse = myState.getMouse(e,1);
		
		
		var mx;
		var my;
		try{
			mx = trackX = (touchPhone==true) ? e.touches[0].pageX : mouse.x;
			my = trackY = (touchPhone==true) ? e.touches[0].pageY : mouse.y;
		}catch(e){
			mx = trackX = mouse.x;
			my = trackY = mouse.y;
		}
		var img = myState.img;
		var checkOver = false;
		var highestDepth = 0;
		var indexHighestDepth = -1;
		// for mouseover
		for(var i=0;i<img.length;i++){
			if(img[i].type=="link"){
				if(hitTest(img[i].whoImg,{x:mx,y:my})){
					if(hitTest(img[i],{x:mx,y:my})){
						visible = (img[i].whoImg.parent==undefined) ? img[i].whoImg.visible : img[i].whoImg.adjustvisible;
						//clickCallback = (img[i].whoImg.parent==undefined) ? img[i].whoImg.clickCallback : img[i].whoImg.clickCallback;
						if(highestDepth<=img[i].whoImg.depth && visible!=false && img[i].whoImg.visible!=false){
							//myState.img[i].hover = true;
							//myState.img[i].visible=true;
							//myState.img[i].alpha = 100;
							//myState.img[i].hover = true;
							indexHighestDepth = i;
							for(lc=0;lc<img.length;lc++){
								if(img[i].conn==img[lc].conn){
									//alert(lc);
									if(myState.img[lc].y+(myState.img[lc].h-3)<img[i].whoImg.y){
										myState.img[lc].hover = false;
									}else{
									myState.img[lc].hover = true;
									myState.img[lc].visible=true;
									myState.img[lc].alpha = 100;
									myState.img[lc].hover = true;
									}
								}
							}
							
							//document.getElementById('game').style.cursor = "pointer";
						}
						if(myState.img[i].hover==true){
							try{
								//myState.img[i].visible=false;
								//img[i].outCallback();
								//if(img[i].elementType!="text") document.getElementById('game').style.cursor = "default";
								//if(img[i].elementType!="text") myState.setCursor();
							}catch(e){}
						}
					}else{
						if(myState.img[i].hover==false){
							try{
								//myState.img[i].visible=false;
								for(lc=0;lc<img.length;lc++){
									if(img[i].conn==img[lc].conn){
										myState.img[lc].visible=false;
										document.getElementById('game').style.cursor = "default";
									}
								}
								//img[i].outCallback();
								//if(img[i].elementType!="text") document.getElementById('game').style.cursor = "default";
								//if(img[i].elementType!="text") myState.setCursor();
							}catch(e){}
						}
						myState.img[i].hover = false;
					}
					//alert(1);
				}
			}else{
				if(hitTest(img[i],{x:mx,y:my})){
					checkOver = true;
					myState.img[i].mouseX = mx;
					myState.img[i].mouseY = my;
					visible = (img[i].parent==undefined) ? img[i].visible : img[i].adjustvisible;
					overCallback = (img[i].parent==undefined) ? img[i].overCallback : img[i].parent.overCallback;
					// Find the Highest Depth that is visible and has Hover function... && overCallback!=undefined 
					if(highestDepth<=img[i].depth && visible!=false && img[i].visible!=false && img[i].overCallback!=undefined){
						myState.img[i].hover = true;
						highestDepth = img[i].depth;
						indexHighestDepth = i;
					}
					// If hover is true, set the GLOBAL cursor and execute RollOut
					if(myState.img[i].hover==true){
						try{
							img[i].outCallback();
							if(img[i].elementType!="text") document.getElementById('game').style.cursor = "default";
							//if(img[i].elementType!="text") myState.setCursor();
						}catch(e){}
					}
				}else{
					// Same above, but we set hover back to false...
					if(img[i].scrollStart==true){
						img[i].scrollDrag = false;
					}
					if(myState.img[i].hover==true){
						try{
							img[i].outCallback();
							if(img[i].elementType!="text") document.getElementById('game').style.cursor = "default";
							//if(img[i].elementType!="text") myState.setCursor();
						}catch(e){}
					}
					myState.img[i].hover = false;
				}
				// If the object is Draggable..
				if(img[i].draggable==true){
					myState.img[i].x = mx - img[i].ox;
					myState.img[i].y = my - img[i].oy;	
				}
			}
		}
		try{
			//If there is no MouseOver object found, don't execute GLOBAL handCursor
			if(indexHighestDepth!=-1){
				//alert(indexHighestDepth);
				if(img[indexHighestDepth].elementType!="text" && img[indexHighestDepth].setHandCursor == true) document.getElementById('game').style.cursor = "pointer";
				else{
					document.getElementById('game').style.cursor = "default";
				}
				
				
				//if(img[indexHighestDepth].elementType!="text") myState.setHandCursor();
			}
			img[indexHighestDepth].overCallback();
		}catch(e){};
	},true);
	//Look for the highest depth on all objects..
	canvas.getIndexHighestDepth = function(){
		var img = myState.img;
		highest = 0;
		index = 0;
		for(var i=0;i<img.length;i++){
			if(highest<=img[i].depth){
				highest = img[i].depth;
				index = i;
			}
		}	
		return index;
	}
	

	
	
	myState.interval = setInterval(function() { myState.draw(); }, myState.fps);
	
	
}	
movieCanvas.prototype.getNextHighestDepth = function(){
	var img = this.img;
	highest = 0;
	
	for(var i=0;i<img.length;i++){
		if(highest<=img[i].depth){
			highest = img[i].depth;
		}
	}

	return highest+1;
}
movieCanvas.prototype.lastRecordedX = 0;
movieCanvas.prototype.lastRecordedY = 0;
movieCanvas.prototype.getMouse = function(e,test) {
	var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;
	var percentage;
	// Compute the total offset
	
	if (element.offsetParent !== undefined) {
		do {
			offsetX += element.offsetLeft;
			offsetY += element.offsetTop;
		} while ((element = element.offsetParent));
	}
	mx = e.pageX - offsetX;
	my = e.pageY - offsetY;

	if(this.fullScreen==true){
	// for Fullscreen;
	percentage = (mx/window.innerWidth)*100;
	mx = (percentage*720)/100;
	
	percentage = (my/$("#game").height())*100;
	my = (percentage*400)/100;
	}
	if(mx==0 && my==0){
		mx = this.lastRecordedX;	
		my = this.lastRecordedY;	
	}else{
		this.lastRecordedX = mx;	
		this.lastRecordedY = my;	
	}
	//document.getElementById("trace").innerHTML = "X:"+mx+" / Y:"+my;
	return {x: mx, y: my};
}
movieCanvas.prototype.addChild = function(a) {
	// Let's add the Image and Shape to the Object Array
	a.root = this;
	this.img.push(a);
	this.img[this.img.length-1].f = 0;
	this.img[this.img.length-1].depth = this.img.length-1;
	this.img[this.img.length-1].alpha = 100;
	this.valid = false;
	
	
}
movieCanvas.prototype.drawRect = function (width, height, radius, size, fill, stroke, alpha) {
	x = y = size/2;
	var buffer = document.createElement("canvas");
	var ctx = buffer.getContext('2d');
	buffer.width = width;
	buffer.height = height;
	width -= size*2;
	height -= size*2;
	ctx.lineWidth = size;
	if(alpha){
		ctx.globalAlpha = alpha;
	}
	ctx.fillStyle = fill;
	ctx.strokeStyle = stroke;
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + width - radius, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
	ctx.lineTo(x + width, y + height - radius);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	ctx.lineTo(x + radius, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
	ctx.lineTo(x, y + radius);
	ctx.quadraticCurveTo(x, y, x + radius, y);
	ctx.closePath();
	if (stroke) {
		ctx.stroke();
	}
	if (fill) {
		ctx.fill();
	}
	return buffer;
} 
movieCanvas.prototype.drawLink = function (width, height, radius, size, fill, stroke, alpha) {
	x = y = size/2;
	var buffer = document.createElement("canvas");
	var ctx = buffer.getContext('2d');
	buffer.width = width;
	buffer.height = height;
	width -= size*2;
	height -= size*2;
	ctx.lineWidth = size;
	if(alpha){
		ctx.globalAlpha = alpha;
	}
	ctx.fillStyle = fill;
	ctx.strokeStyle = stroke;
	ctx.beginPath();
	ctx.moveTo(x , y + height);
	ctx.lineTo(x + width, y + height);
	ctx.closePath();
	if (stroke) {
		ctx.stroke();
	}
	if (fill) {
		ctx.fill();
	}
	return buffer;
} 

movieCanvas.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.width, this.height);
}

movieCanvas.prototype.multiFillText = function(text, x, y, lineHeight, fitWidth, fontSize, font, color, align, height, autoFit,valign,shadowColor,shadowOffsetX,shadowOffsetY,shadowBlur) {
	//if(shadowColor!=undefined)alert(shadowColor);
	var linkHref = [];
	var linkTarget = [];
	text.replace(/(<a (href=\')([^\'']*)(\') (target=\')([^\'']*)(\')>([^\'']*)<\/a>)/g,function() {
	//text.replace(/(<a href='([^"]+)' target='([^"]+)'>([^<]+)<\/a>)/g,function() {
		// for target value alert(arguments[6]);
		// for href value alert(arguments[3]);
		//alert(arguments[3]);
		linkHref.push(arguments[3]);
		linkTarget.push(arguments[6]);
		text = text.replace(arguments[0],"¡"+arguments[8]+"·"); 
	});
	adjustY = 0;
	adjustedY = false;
	do{
		x = 0;
		y = lineHeight+100;
		//alert(text);
		
		//$url = preg_match('/<a href="(.+)">/', $text, $match);

		//alert(text.match(/<a href='(.+)'>/));
		this.textFillCounter++;
		var buffer = document.createElement("canvas");
		var ctx = buffer.getContext('2d');
		var linkbuffer = false;
		buffer.width = fitWidth;
		origHeight = height;
		height = 1800;
		
		if(height==undefined) height = 1800;
		buffer.height = height;
		
		if(fontSize==undefined) fontSize = 20;
		if(font==undefined) font = "Arial";
		if(color==undefined) color = "#000000";
		if(align==undefined) align = "left";
		
		
		
		
		
		ctx.font = fontSize+"px "+font;
		ctx.textAlign = align;
		ctx.fillStyle = color;
		
		if(shadowColor!=undefined) ctx.shadowColor = shadowColor;
		if(shadowOffsetY!=undefined) ctx.shadowOffsetY = shadowOffsetX;
		if(shadowOffsetX!=undefined) ctx.shadowOffsetX = shadowOffsetY;
		if(shadowBlur!=undefined) ctx.shadowBlur = shadowBlur;
		//ctx.strokeStyle = "#ffffff";
		
		
		var draw = x !== null && y !== null;
		var cutOff = 210;
		var DEBUG = false;
		var wordIndex = 0;
		
		text = String(text);
		text = text.replace(/\\\\n/g, "&#92;n");
		text = text.replace(/\\n/g, "\n");
		text = text.replace(/&#92;n/g, "\\n");
		//text = text.replace(/(\r\n|\n\r|\r|\n)/g, "\n");
		sections = text.split("\n");
		//alert(escape(sections));
		var i, str, wordWidth, words, currentLine = 0,
			maxHeight = 0,
			maxWidth = 0,drawLine=0;;
	
		var printNextLine = function(str,ctx) {
			
			//text.replace(/(<a (href=\')([^\'']*)(\') (target=\')([^\'']*)(\')>([^\'']*)<\/a>)/g,function() {
			//text.replace(/(<a href='([^"]+)' target='([^"]+)'>([^<]+)<\/a>)/g,function() {
				// for target value alert(arguments[6]);
				// for href value alert(arguments[3]);
				//alert(arguments[3]);
				//linkHref.push(arguments[3]);
				str = str.replace(/(\¡)/g,'').replace(/(\·)/g,''); 
			//});
			if(draw){ 
				adjustx = (align=="center") ? (x+(fitWidth/2)) : x;
				ctx.fillText(str, adjustx, y + (lineHeight * currentLine)+adjustY);
				//if(str!="") drawLine++;
			}
			//alert(str);
			currentLine++;
			wordWidth = ctx.measureText(str).width;
			if (wordWidth > maxWidth) {
				maxWidth = wordWidth;
			}
		};
		var linkFound = 0;
		//alert(text);
		var linkComFound = 0;
		for (i = 0; i < sections.length; i++) {
			words = sections[i].split(' ');
			index = 1;
			var linkWidth = "";
			var linkDetect = false;
			var linkCon = false;
			var tmpX = 0;
			var tmpY = 0;
			var linkCom = 0;
			
			while (words.length > 0 && index <= words.length) {
	
				
				str = words.slice(0, index).join(' ');
				
				wordWidth = ctx.measureText(str).width;
				perWord = words[index-1];
				//var linkL = new RegExp(linkWord, 'gi');
				
				perWordEnd = words[index-2];
				
				if(linkDetect==true){
					if(linkWidth){
						linkWidth = linkWidth+' '+perWordEnd;
						
					}else{
						linkWidth = perWordEnd;
					}
				}
				
				var myRegexp = /\¡/;
				if (wordWidth > fitWidth) {
					//Cancel pushing link box, because word is not fit in current box
					//alert(perWord+":"+str);
				}else{
					var linkMatch = myRegexp.exec(perWord);
					//alert(perWord+" | "+str);
					// Start of link <A href=""....
					
					
					
					if(myRegexp.test(perWord)){
						
						//alert("|"+words.slice(0, index-1).join(' ')+' '+"|");
						linkWidth = "";
						//linkCreate
						linkbuffer = true;
						linkComFound++;
						linkCom = linkComFound+":"+this.textFillCounter;
						//alert(linkCom);
						if(words[index-2]==""){
							tmpX = ctx.measureText(words.slice(0, index-2).join(' ')+' ').width;
							//alert(words.slice(0, index-2).join(' ')+":");
						}else{
							if(words.slice(0, index-1).join(' ')==""){
								tmpX = ctx.measureText(words.slice(0, index-1).join(' ')+'').width;
							}else{
								tmpX = ctx.measureText(words.slice(0, index-1).join(' ')+' ').width;
							}
							//alert(words.slice(0, index-1).join(' ')+":");
						}
						//ctx.font = "Italic "+fontSize+"px "+font;
						//this.linkCreate.push({x:ctx.measureText(words.slice(0, index-1).join(' ')).width,y:lineHeight * currentLine});
						linkDetect = true;
						
					}
					
					// If link are not terminated and in new lines.. add new click Box
					if(linkCon==true && index==1){
						//linkComFound++;
						linkCom = linkComFound+":"+this.textFillCounter;
						tmpX = ctx.measureText(words.slice(0, index-1).join(' ')).width;
						
						tmpY = lineHeight * currentLine;
						//this.linkCreate.push({x:ctx.measureText(words.slice(0, index-1).join(' ')).width,y:lineHeight * currentLine});
						
						linkDetect = true;
					}
					// Copy the word to get the width of link box
					
					
					
					// If we are on the end of link -> </a>
				
					if(linkDetect==true){
						var myRegexp = /·/;
						if(myRegexp.test(perWordEnd)){
							tmpY = lineHeight * currentLine;
							this.linkCreate.push({x:tmpX,y:tmpY,w:ctx.measureText(linkWidth.replace(/(\¡)/g,'').replace(/(\·)/g,'')).width,id:this.textFillCounter,href:linkHref[linkFound],target:linkTarget[linkFound],conn:linkCom});
							linkWidth = "";
							linkFound++;
							linkDetect = false;
							linkCon = false;
						}
					}
					
				}
				

				
				if (wordWidth > fitWidth) {
					
					if (index === 1) {
						// Falls to this case if the first word in words[] is bigger than fitWidth
						// so we print this word on its own line; index = 2 because slice is
						linkWidth = "";
						linkbuffer = true;
						linkComFound++;
						linkCom = linkComFound+":"+this.textFillCounter;
						tmpX = 0;
						
						
						str = words.slice(0, 1).join(' ');

						words = words.splice(1);
						linkWidth = str;
						linkDetect = true;

						words.unshift(str.substr(50,100));
						str = str.substr(0,50);
						
						//alert(1);
					} else {
						
						str = words.slice(0, index - 1).join(' ');
						words = words.splice(index - 1);
					}
					//If we are on the last word, get the final width of our link box..
					if(linkDetect==true){
						//alert(str);
						//alert(str+"1");
						tmpY = lineHeight * currentLine;
						this.linkCreate.push({x:tmpX,y:tmpY,w:ctx.measureText(linkWidth.replace(/(\¡)/g,'').replace(/(\·)/g,'')).width,id:this.textFillCounter,href:linkHref[linkFound],target:linkTarget[linkFound],conn:linkCom});
						//linkFound++;
						//this.linkCreate[this.linkCreate.length-1].w = ctx.measureText(linkWidth).width;
						linkWidth = "";
						linkDetect = false;
						linkCon = true;
						var linkMatch = myRegexp.exec(perWord);
						var myRegexp = /;\|/;
						if(myRegexp.test(perWordEnd)){
							linkCon = false;	
						}
					}
					printNextLine(str,ctx);
	
					index = 1;
				} else {

					index++;
				}

			
				//var linkR = new RegExp(
				//alert(words[index-2]+ ":"+str);
				wordIndex++;
				
			}
	
			// The left over words on the last line
			if (index > 0) {
				//alert(1);
				
				if(linkDetect==true){
						//alert(linkWidth+words[index-2]);
						//alert("|"+words[index-2].replace(/(\¡)/g,'').replace(/(\·)/g,'')+"|");
						tmpY = lineHeight * currentLine;
						this.linkCreate.push({x:tmpX,y:tmpY,w:ctx.measureText(linkWidth+words[index-2].replace(/(\¡)/g,'').replace(/(\·)/g,'')).width,id:this.textFillCounter,href:linkHref[linkFound],target:linkTarget[linkFound],conn:linkCom});
						linkFound++;
						//this.linkCreate[this.linkCreate.length-1].w = ctx.measureText(linkWidth).width;
						linkWidth = "";
						linkDetect = false;
						linkCon = true;
						
				}
				printNextLine(words.join(' '),ctx);
			}
	
	
		}
	
		maxHeight = lineHeight * (currentLine);
	
		//if (DEBUG) {
			
			//ctx.strokeRect(x, y, maxWidth, maxHeight);
		//}
		//buffer.testwin = drawLine;
		buffer.maxHeight = maxHeight;
		//alert(maxHeight+":"+origHeight);
		
		if((maxHeight)<=origHeight){
			
			
			if(adjustedY==true){
				autoFit=false;
			}
			
			if(valign=="middle"){
				adjustY = ((origHeight-maxHeight)/2)-(fontSize/4);
			}else if(valign=="bottom"){
				adjustY = origHeight-maxHeight;
			}else{
				//Default Top
				adjustY = 0;
			}
			adjustedY=true;
			
		}else{
			height = origHeight;
			//alert(fontSize+">>>"+(maxHeight-100)+":"+origHeight);
			//autoFit=true;
			fontSize--;	
			lineHeight = fontSize+(fontSize/5);
		}
		
	}while(autoFit==true);
	//ctx.restore();
	/*
	var links = [];
	linkStr = text;
	linkStr.replace(/[^<]*(<a href='([^"]+)' target='([^"]+)'>([^<]+)<\/a>)/g,function() {
		links.push(Array().slice.call(arguments, 1, 5));
		
	});
	if(links.length!=0){
		this.linkList.push({img:buffer,href:links[0][1],target:links[0][2],content:links[0][3]});
	}
	*/
	// If we saw link detect.. copy the buffer..
	if(linkbuffer==true){
		
		for(var lb=0;lb<this.linkCreate.length;lb++){
			if(this.linkCreate[lb].id==this.textFillCounter){
				this.linkCreate[lb].img = buffer;
			}
			
		}
	}
	//if(text=="Goal Title"){ 
		//this.linkList.push(buffer);
	//}
	//var imgData = ctx.getImageData(0,0,10,10);
	//ctx.drawImage(imgData, x, y,0,0,10,10);
	//ctx.fillText(maxHeight+" "+origHeight,x,y+20);
	//document.body.appendChild(buffer);
	return buffer;
};