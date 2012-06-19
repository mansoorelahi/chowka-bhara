function poke() {
now.pokeMesg();
}

Array.prototype.findIndex = function(value){
		var ctr = "";
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
	this.occupied = 1;
	this.occupied_player = 0;
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


function isLegal(pawn_moved, from_box, to_box, value) {
	var player_id = getPlayerId(pawn_moved);
	var from_indx = players[player_id-1].path.findIndex(from_box);
	var to_indx = players[player_id-1].path.findIndex(to_box);

	if((to_indx - from_indx) == value){
		return true
	}
	//console.log(pawn_moved);
	//console.log(from_box);
	//console.log(to_box);
	//console.log(value);
	return false;

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

function getBoxId(x, y) {

	x = x - 200;
	y = y - (y%82);
	
	_i = Math.floor(x / 82);
	_j = Math.floor(y/ 82);

	//console.log(boxes[_i*10+_j]);
	_id = _i*10+_j;
	return _id
}

function getPawnById(pawn_id) {
	for(i = 0; i < pawns.length; i++)
	{
		if(pawns[i].fig.id == pawn_id)
		{
			return pawns[i];
		}
	}

}

now.updatePawn = function(pawn_id, att) {

	var pawn = getPawnById(pawn_id);
	pawn.fig.attr(att);

}

var pawns= [];
var boxes = [];
var players = [];
var value = 0;
window.onload = function () {
//	r.rect(200, 20, 325, 325, 2);
	var r = Raphael("holder", 840, 840);
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
				value = 1;

				var att =  this.type == "rect" ? {x: this.ox + dx, y: this.oy + dy} : {cx: this.attrs.cx, cy: this.attrs.cy};
				now.update(this.id, att);
				if(!isLegal(this.id, from_id, to_id, value))
				{
					var att = this.type == "rect" ? {x: this.ox, y: this.oy} : {cx: this.ox , cy: this.oy};
					this.attr(att);
					now.update(this.id, att);
					r.safari();
				}
		};

	count = 0;
//create the basic layout
	for(i = 1 ; i <= 5 ; i++)
	{
		for(j = 1; j <= 5; j++)
		{
			var rect = r.rect(200 + i*80 + i * 2, j * 80 + j *2, 80, 80, 2);
			boxes[i*10 + j] = rect;

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
								pawn.home = count;
								pawn.currentBox = count;
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
