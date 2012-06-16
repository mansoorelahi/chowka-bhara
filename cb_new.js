Array.prototype.findIndex = function(value){
		var ctr = -1;
		for (var i=0; i < this.length; i++) {
				// use === to check for Matches. ie., identical (===), ;
				if (this[i] == value) {
						return i;
				}
		}
		return ctr;
};

function Pawn () {
	this.home = 1;
	this.player = 1;
	this.currentBox = this.home;
}

function Box() {
	this.occupied = 0;
	this.occupied_player = [];
	this.has_two = 0;
	this.has_three = 0;

}

function Player() {
	this.id = 0;
	this.path = [];
	this.startBox = null;
	
	this.getPath = function() {
		return this.path;
	}

	this.getId = function() {
		return this.id;
	}

}

function getPlayerId(pawn_id) {
	//console.log(pawn_id);
	var player_id = 0;
	var val = Math.floor(pawn_id/10);
	//console.log(val);
	switch(val) {
	case 1:
		player_id = 4;
		break;
	case 2:
		player_id = 1;
		break;
	case 3:
		player_id = 3;
		break;
	case 4:
		player_id = 2;
		break;
	default: player_id = 0;
	}
	return player_id;	
	
}

function getPawnById(pawn_id) {
	for(i = 0; i< pawns.length; i++)
	{
		if(pawns[i].fig.id == pawn_id)
		{
			return pawns[i];	
		}
	}
	
}

function getBoxId(x, y) {

	x = x - 200;
	y = y - (y%82);
	
	_i = Math.floor(x / 82);
	_j = Math.floor(y/ 82);

	//console.log(boxes[_i*10+_j]);
	_id = _i*10+_j;
	return _id
}

function getBoxDim(id) {

	y = (id%10)*82;
	x = (id/10)*82 +200;

	dim = {};
	dim.x = x;
	dim.y = y;
	return dim;

}

/*
function getBoxById(id) {
	for(i = 0 ; i < boxes.length; i++){
		if(boxes[i].id == id)
			return boxes[i];
	}
	return null
}
*/
function create_players(num) {
//hard coding all the values
	var player = new Player();
	player.id = 1;
	player.startBox = 13;
	player.path = [31, 21, 11, 12, 13, 14, 15, 25, 35, 45, 55, 54, 53, 52, 51, 41, 42, 43, 44, 34, 24, 23, 22, 32, 33];
	players[0] = player;

	player = new Player();
	player.id = 2;
	player.startBox = 53;
	player.path = [53, 52, 51, 41, 31, 21, 11, 12, 13, 14, 15, 25, 35, 45, 55, 54, 44, 34, 24, 23, 22, 32, 42, 43, 33];
	players[1] = player;

	player = new Player();
	player.id = 3;
	player.startBox = 35;
	player.path = [35, 45, 55, 54, 53, 52, 51, 41, 31, 21, 11, 12, 13, 14, 15, 25, 24, 23, 22, 32, 42, 43, 44, 34, 33];
	players[2] = player;

	player = new Player();
	player.id = 4;
	player.startBox = 13;
	player.path = [13, 14, 15, 25, 35, 45, 55, 54, 53, 52, 51, 41, 31, 21, 11, 12, 22, 32, 42, 43, 44, 34, 24, 23, 33];
	players[3] = player;

}

function returnHome(pawn_id){
	home_dim = getBoxDim(pawn_id.home);
	x = home_dim.x + 35 + Math.floor(Math.random()*30);
	y = home_dim.y + 35 + Math.floor(Math.random()*30);
	var att = pawn_id.type == "rect" ? {x: x, y: y} : {cx: x , cy: y};
	pawn_id.fig.attr(att);
}

function isPairing(pawn_moved, from_box, to_box) {
	if(boxes[to_box].occupied != 0)
	{
		var pawn1 = getPawnById(pawn_moved);
		var pawn2 = getPawnById(boxes[to_box].occupied_player[0]);
		if(pawn1.home == pawn2.home)
		{
			boxes[to_box].occupied_player.push(pawn_moved);
			return true;
		}
		else
		{
			return false;
		}
	}
	else
	{
		boxes[to_box].occupied = 1;
		boxes[to_box].occupied_player.push(pawn_moved);
		return true;
	}
}

function isAttackSuccessful(pawn_moved, from_box, to_box) {
	
		if(boxes[to_box].occupied != 0)
		{	
			if(boxes[to_box].has_two == 1)
			{
				return false;
			}
			else if(safe_houses.findIndex(to_box)>=0){
				return false;
			}
			else
			{	
				pawn_attacked = getPawnById(boxes[to_box].occupied_player[0]);
				console.log(pawn_attacked);
				returnHome(pawn_attacked);
				boxes[to_box].occupied_player[0] = pawn_moved;
			}
		}

		return true;
}

function isLegal(pawn_moved, from_box, to_box, value) {
	var player_id = getPlayerId(pawn_moved);
	var from_indx = players[player_id-1].path.findIndex(from_box);
	var to_indx = players[player_id-1].path.findIndex(to_box);

	//console.log(from_box);
	//console.log(from_indx);

	//console.log(to_indx);
	//console.log(to_box);


	if((to_indx - from_indx) == value){
		if(!isPairing(pawn_moved, from_id, to_id))
		{
			if(!isAttackSuccessful(pawn_moved, from_id, to_id))
			{
				return false;
			}
			else 
			{
				return true;
			}
		}
		else
		{
			return true;
		}
	}

	//console.log(pawn_moved);
	//console.log(from_box);
	//console.log(to_box);
	//console.log(value);
	return false;

}

var pawns= [];
var boxes = [];
var safe_houses = [31,53, 35, 13, 33];
var paired = [];
var players = [];
var value = 0;
window.onload = function () {
	var r = Raphael("holder", 840, 840);
//	r.rect(200, 20, 325, 325, 2);
	var dragger = function () {
			this.ox = this.type == "rect" ? this.attr("x") : this.attr("cx");
			this.oy = this.type == "rect" ? this.attr("y") : this.attr("cy");
			this.animate({"fill-opacity": .2}, 500);
	},
		move = function (dx, dy) {
				var att = this.type == "rect" ? {x: this.ox + dx, y: this.oy + dy} : {cx: this.ox + dx, cy: this.oy + dy};
				this.attr(att);
			r.safari();
		},
		up = function () {
				this.animate({"fill-opacity": 0}, 500);
				from_id = getBoxId(this.ox, this.oy);
				to_id = getBoxId(this.attrs.cx , this.attrs.cy);
				if(!isLegal(this.id, from_id, to_id, value))
				{
					var att = this.type == "rect" ? {x: this.ox, y: this.oy} : {cx: this.ox , cy: this.oy};
					this.attr(att);
					r.safari();
					this_pawn.currentBox = from_id;
				}
				else
				{
					this_pawn = getPawnById(this.id);
					this_pawn.currentBox = to_id;
					value = 0;
				}
			
		};

	count = 0;
//create the basic layout
	for(i = 1 ; i <= 5 ; i++)
	{
		for(j = 1; j <= 5; j++)
		{
			var box = new Box(); 
			var rect = r.rect(200 + i*80 + i * 2, j * 80 + j *2, 80, 80, 2);
			box.id = i*10 + j;
			box.rect = rect;
			
			boxes[i*10 + j] = box;

			if( ((i == 1 || i == 5 || i == 3) && (j == 3) || (j == 1 || j == 5 || j == 3) && (i == 3)))
			{
				var x1 = 200 + i*80 + i * 2;
				var y1 = j * 80 + j *2;
				var x2 = 200 + i*80 + i * 2 + 80;
				var y2 = j * 80 + j *2 + 80;
				var path_str = "M"+x1+" "+y1+"L"+x2+ " "+y2;
				r.path(path_str);
				
				x1 = x1+80;
				x2 = x2-80;
				path_str = "M"+x1+" "+y1+"L"+x2+ " "+y2;
				r.path(path_str);
//for a 2 player game.. it shud be different
			
				if(!(i==3 && j==3))
				{
				//	box.occupied = 1;
					count = count +1;
						//create pawns
						x1 = x1 - 80;

						var pawn_no = 0;
						for(k = 1; k<= 2; k++)
						{
							for(p = 1; p <= 2; p++)
							{
								pawn_no = pawn_no + 1;
								pawn = new Pawn();
								var fig = r.circle(x1 + k*25, y1+ p*25, 10);
								pawn.fig = fig;
								fig.id = count*10+pawn_no;
								pawn.home = i*10 + j;
								pawn.currentBox = i*10 + j;
								pawn.player = count;
								pawns.push(pawn);
							}
						}
				}


			}
		}
	}
	var count = 0;
	for (var i = 0, ii = pawns.length; i < ii; i++) {
			var color;
			if(!(count%4))
			{
				color = Raphael.getColor();
				count = 0;
			}
			count = count + 1;
			pawns[i].fig.attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
			pawns[i].fig.drag(move, dragger, up);
	}
	create_players(4);
}

function play_game(){
	vals = [1,2,3,4,8];
	_val = Math.floor(Math.random()*10);
	if(vals.findIndex(_val)>=0)
	{
		window.value = window.value + _val;
	}
	else
	{
		play_game();
	}
	var myScore = document.getElementById('score');
	console.log(myScore);
	score.innerHTML = window.value;
	return value;
}

