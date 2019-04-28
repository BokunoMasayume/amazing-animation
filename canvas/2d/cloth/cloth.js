/*
*before I try to understand how to simulate the cloth active,
*I thought it must be very complicated,
*But in fact ,it is so straight and simple,
*physic is truly beautiful
*/

;(function(){
// 	"use strict"
	/**
	*obj={
	*	canvas = canvas element,
	*	ctx = ctx //ctx or canvas,not nessary support both 
	*	numrow = how many cell-rows(cell number in y-axis),
	*	numcol = how many cell-cols(cell number in x-axis),
	*	space  = the size of one cell,
	*	start  ={
	*			x:x,
	*			y:y,
	*			}//start
	*	gravity = {x:0,y:1200}重力加速度,
	*   tear_distance = 撕裂距离,
	*	mouse_influence = 光标影响范围,
	*	mouse_cut = 剪切影响范围,
	*	render_times = 每次更新前物理作用渲染次数
	*}//obj
	*   cell 指每个纵横线间形成的小格子
	*/
	window.Cloth = function(obj){
		this.canvas = obj.canvas;
		this.ctx = obj.ctx || obj.canvas.getContext('2d');
		this.numrow = obj.numrow || 60 ;
		this.numcol = obj.numcol || 30 ;
		this.space = obj.space || 10;
		this.gravity = {x:0,y:1200};
		// this.gravity = obj.gravity || {x:0,y:1200};
		this.tear_distance = obj.tear_distance || 50;
		this.mouse_influence = obj.mouse_influence || 10;
		this.mouse_cut = obj.mouse_cut || 5;
		this.render_times = obj.render_times || 3;
		this.points = [];
		this.mouse = {
			x:0,
			y:0,
			perv_x:0,
			perv_y:0,
			down:false,
			button:1
		};
		obj.start?this.start=obj.start: this.start={x:0,y:0};

		/*
		*Class Point(position-x,position-y)
		*/
		this.Point = function(x,y){
			this.x = x;
			this.y = y;
			this.perv_x = x;
			this.perv_y = y;
			this.pin_x = null;
			this.pin_y = null;
			//acceleration 加速度
			let gra = gravity;
			this.acce_x = gra.x;
			this.acce_y = gra.y;

			this.constraints = [];
		};

		this.Point.prototype.renderConstraints = function(){
			for(let i=0 ; i<this.constraints.length;i++){
				this.constraints[i].render();
			}
		};

		this.Point.prototype.renderGravity = function(delta){
			if(mouse.down){
				let dist_x = this.x - mouse.x;
				let dist_y = this.y - mouse.y;
				let dist = Math.sqrt(dist_x*dist_x + dist_y*dist_y);
				if(mouse.button==1){
					if(dist < mouse_influence){
						this.perv_x = this.x - (mouse.x - mouse.perv_x);
						this.perv_y = this.y - (mouse.y - mouse.perv_y);
					}
				}else{
					if(dist < mouse_cut){
						this.constraints = [];
					}
				}
			}


			delta *= delta;
			let next_x = this.x + (this.x - this.perv_x) + (this.acce_x * delta)*0.5;
			let next_y = this.y + (this.y - this.perv_y) + (this.acce_y * delta)*0.5;

			this.perv_x = this.x;
			this.perv_y = this.y;

			this.x = next_x;
			this.y = next_y;

			if(this.pin_x !=null && this.pin_y!=null){
				this.x = this.pin_x;
				this.y = this.pin_y;
			} 

		};

		this.Point.prototype.draw = function(){
			for(let i=0;i<this.constraints.length;i++){
				this.constraints[i].draw();

			}
		}
		this.Point.prototype.pin = function(x,y){
			this.pin_x = x;
			this.pin_y = y;
		};

		this.Point.prototype.removeConstraint = function(constraint){
			this.constraints.splice(this.constraints.indexOf(constraint),1);
		};



		/*
		*Class Constraint (a-point,another-point)
		*/
		this.Constraint = function(pa,pb){
			this.pa = pa;
			this.pb = pb;
		}
		this.Constraint.prototype.render = function(){
			let dist_x = pa.x - pb.x;
			let dist_y = pa.y - pb.y;
			let dist = Math.sqrt(dist_x*dist_x + dist_y*dist_y);
			let fibreForce =  (space - dist)/dist;
			if(dist > tear_distance){
				this.pb.removeConstraint(this);
				return;
			}

			let dx = dist_x * fibreForce * 0.5;
			let dy = dist_y * fibreForce * 0.5;
			this.pa.x -= dx;
			this.pa.y -= dy;
			this.pb.x -= dx;
			this.pb.y -= dy;
		};

		this.Constraint.prototype.draw = function(){
			ctx.moveTo(this.pa.x , this.pa.y);
			ctx.lineTo(this.pb.x , this.pb.y);
		};



		// for(let y=0 ; y <= this.numrow ;y++){
		// 	this.points[y] = [];
		// 	for(let x=0;x <= this.numcol ;x++ ){
				
		// 		let point = new this.Point(x*this.space , y*this.space);
		// 		this.points[y].push(point);

		// 		x!=0 && point.constraints.push(this.points[y][x-1],point);
		// 		y!=0 && point.constraints.push(this.points[y-1][x], point);
		// 		y==0 && point.pin(x*this.space , y*this.space);
		// 	}
		// }

	};//Class Cloth 
	window.Cloth.prototype.init = function(){
		for(let y=0 ; y <= this.numrow ;y++){
			this.points[y] = [];
			for(let x=0;x <= this.numcol ;x++ ){
				
				let point = new this.Point(x*this.space , y*this.space);
				this.points[y].push(point);

				x!=0 && point.constraints.push(this.points[y][x-1],point);
				y!=0 && point.constraints.push(this.points[y-1][x], point);
				y==0 && point.pin(x*this.space , y*this.space);
			}
		}
	};
	window.Cloth.prototype.update = function(){
		for(let i=0;i<this.render_times;i++){
			for(let y=0;y<=this.numrow;y++){
				for(let x=0 ; x<=this.numcol;x++){
					this.points[y][x].renderConstraints();
				}
			}
		}

		for(let y=0 ; y<=this.numrow;y++){
			for(let x = 0 ; x<=this.numcol ; x++){
				this.points[y][x].renderGravity(.016);
			}
		}
	};//Cloth.update

	window.Cloth.prototype.draw = function(){
    	this.ctx.clearRect(0, 0, canvas.width, canvas.height);

		this.ctx.beginPath();
		for(let y=0 ; y<=this.numrow;y++){
			for(let x = 0 ; x<=this.numcol ; x++){
				this.points[y][x].draw();
			}
		}
		this.ctx.stroke();
	};//Cloth.draw

	window.Cloth.prototype.bindEvent = function(canv){
		this.canvas = canv || this.canvas;
		let that = this;
		this.canvas.addEventListener("mousedown",function(e){
			that.mouse.button = e.which;
	        that.mouse.perv_x = that.mouse.x;
	        that.mouse.perv_y = that.mouse.y;
	        var rect = that.canvas.getBoundingClientRect();//返回元素大小及其相对于视口的位置
	        that.mouse.x = e.clientX - rect.left;
	        that.mouse.y = e.clientY - rect.top;
	        that.mouse.down = true;
	        e.preventDefault();
		});

		this.canvas.addEventListener("mouseup",function(e){
			that.mouse.down = false;
       		e.preventDefault();
		});
		this.canvas.addEventListener("mousemove",function(e){
			that.mouse.button = e.which;
	        that.mouse.perv_x = that.mouse.x;
	        that.mouse.perv_y = that.mouse.y;
	        var rect = that.canvas.getBoundingClientRect();//返回元素大小及其相对于视口的位置
	        that.mouse.x = e.clientX - rect.left;
	        that.mouse.y = e.clientY - rect.top;
	        e.preventDefault();
		});
		this.canvas.addEventListener("contextmenu",function(e){
       		e.preventDefault();

		});
	};
}());