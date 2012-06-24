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
	this.inc_id = 1;
}

function Box() {
	this.occupied = 0;
	this.occupied_player = new Array();
	this.has_two = 0;
	this.has_three = 0;

}

function Player() {
	this.id = 0;
	this.path = [];
	this.startBox = null;
	this.has_killed = 0;
	
	this.getPath = function() {
		return this.path;
	}

	this.getId = function() {
		return this.id;
	}

}

function getPlayerId(pawn_id) {
	var player_id = 0;
	var val = Math.floor(pawn_id/100);
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

	x = x - left_width;
	y = y - (y%82);
	
	_i = Math.floor(x / 82);
	_j = Math.floor(y/ 82);

	_id = _i*10+_j;
	return _id
}

function getBoxDim(id) {
	y = Math.floor(id%10)*80 + Math.floor(((id%10) - 1)*2);
	x = Math.floor(id/10)*80 + Math.floor(((id/10) - 1)*2) + left_width;

	dim = {};
	dim.x = x;
	dim.y = y;

	return dim;

}

function create_players(num) {
//hard coding all the values
	var player_1 = new Player();
	player_1.id = 1;
	player_1.startBox = 13;
	player_1.path = [31, 21, 11, 12, 13, 14, 15, 25, 35, 45, 55, 54, 53, 52, 51, 41, 42, 43, 44, 34, 24, 23, 22, 32, 33];
	players[0] = player_1;

	var player_2 = new Player();
	player_2.id = 2;
	player_2.startBox = 53;
	player_2.path = [53, 52, 51, 41, 31, 21, 11, 12, 13, 14, 15, 25, 35, 45, 55, 54, 44, 34, 24, 23, 22, 32, 42, 43, 33];
	players[1] = player_2;

	var player_3 = new Player();
	player_3.id = 3;
	player_3.startBox = 35;
	player_3.path = [35, 45, 55, 54, 53, 52, 51, 41, 31, 21, 11, 12, 13, 14, 15, 25, 24, 23, 22, 32, 42, 43, 44, 34, 33];
	players[2] = player_3;

	var player_4 = new Player();
	player_4.id = 4;
	player_4.startBox = 13;
	player_4.path = [13, 14, 15, 25, 35, 45, 55, 54, 53, 52, 51, 41, 31, 21, 11, 12, 22, 32, 42, 43, 44, 34, 24, 23, 33];
	players[3] = player_4;


}

function returnHome(pawn_id){
	home_dim = getBoxDim(pawn_id.home);
	x = home_dim.x + (pawn_id.inc_id%10)*25;
	y = home_dim.y + (pawn_id.inc_id/10)*25;
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
//change here for occupied = 2;
//try changing to [1] instead of push
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
//instead of push - change the first element
		//boxes[to_box].occupied_player.push(pawn_moved);
		if(safe_houses.findIndex(to_box)>=0) {
			console.log("do_nothing");
		}
		else	if(boxes[from_box].occupied_player.length == 1) {
			boxes[from_box].occupied = 0;
			boxes[from_box].occupied_player.splice(0,1);
		}

		boxes[to_box].occupied_player[0] = pawn_moved;
		return true;
	}
}

function isAttackSuccessful(pawn_moved, to_box) {
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
				free_hit =1;
			}
		}

		return true;
}

function isLegal(pawn_moved, from_id, to_id, value) {
	var player_id = getPlayerId(pawn_moved);
	var from_indx = players[player_id-1].path.findIndex(from_id);
	var to_indx = players[player_id-1].path.findIndex(to_id);

	if(player_id != (now.turn + 1)) {
                return false;
        }

	var inner_square = [42, 43, 44, 34, 24, 23, 22, 32, 33];

	if((inner_square.findIndex(to_id) >= 0 ) && (players[player_id-1].has_killed == 0)) {
		return false;
	}
//if from_box has 2 pawns - then gatti break 
//isPairing should have .occupied = 2
//this should make it one.
//it will also solve attacking gatti problem

	if((to_indx - from_indx) == value){
		if(!isPairing(pawn_moved, from_id, to_id))
		{
			if(!isAttackSuccessful(pawn_moved, to_id))
			{
				return false;
			}
			else 
			{
				players[player_id-1].has_killed = 1;
				return true;
			}

		}
		else
		{
			return true;
		}
	}
	return false;
}

now.updatePawn = function(pawn_id, att, from_id, to_id) {
//if pawn is not moved already
	if(!is_pawn_moved)
	{
		var pawn = getPawnById(pawn_id);
		//if pawns's currentBox is same as to_id - do nothing
		if(pawn.currentBox == to_id) {
			is_pawn_moved = 0;
			return;
		}
		if(!isPairing(pawn_id, from_id, to_id))
		{
			if(isAttackSuccessful(pawn_id, to_id)) {
				console.log("attack propogated");
			}
		}
		pawn.currentBox = to_id;
		pawn.fig.attr(att);
		boxes[from_id].occupied = 0;
                boxes[to_id].occupied = 1;
	}
	is_pawn_moved = 0;
}

var is_pawn_moved = 0;
var pawns= [];
var boxes = [];
var safe_houses = [31,53, 35, 13, 33];
var paired = [];
var players = [];
var values = [];
var value = 0;
var uuid = 0;
var free_hit = 0;
var cb_hit = 0;
var left_width = 100;

window.onload = function () {
	var r = Raphael("holder", 640, 640);	
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
				if(from_id == to_id) {
					var att =  this.type == "rect" ? {x: this.ox + dx, y: this.oy + dy} : {cx: this.attrs.cx, cy: this.attrs.cy};
					this_pawn = getPawnById(this.id);
                                        this_pawn.currentBox = to_id;
					now.update(this.id, att, from_id, to_id);
					return;
				}
				window.value = values.pop();
				if(!isLegal(this.id, from_id, to_id, value))
				{
					var att = this.type == "rect" ? {x: this.ox, y: this.oy} : {cx: this.ox , cy: this.oy};
					this_pawn = getPawnById(this.id);
					this.attr(att);
					r.safari();
					this_pawn.currentBox = from_id;
					values.push(value);
				}
				else
				{
					var att =  this.type == "rect" ? {x: this.ox + dx, y: this.oy + dy} : {cx: this.attrs.cx, cy: this.attrs.cy};
					this_pawn = getPawnById(this.id);
					this_pawn.currentBox = to_id;
					if(values.length <=0) {
						values = [];
						now.turn_change();
						value = 0;
					}
					boxes[from_id].occupied = 0;
					boxes[to_id].occupied = 1;
					//make the pawn moved to true so that it wont get moved again
					is_pawn_moved = 1;
					now.update(this.id, att, from_id, to_id);
				console.log("coming");
				}
			
		};

	count = 0;
//create the basic layout
	for(i = 1 ; i <= 5 ; i++)
	{
		for(j = 1; j <= 5; j++)
		{
			var box = new Box(); 
			var rect = r.rect(left_width + i*80 + i * 2, j * 80 + j *2, 80, 80, 2);
			box.id = i*10 + j;
			box.rect = rect;
			
			boxes[i*10 + j] = box;

			if( ((i == 1 || i == 5 || i == 3) && (j == 3) || (j == 1 || j == 5 || j == 3) && (i == 3)))
			{
				var x1 = left_width + i*80 + i * 2;
				var y1 = j * 80 + j *2;
				var x2 = left_width + i*80 + i * 2 + 80;
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
								pawn_no = k*10 + p;
								pawn = new Pawn();
								var fig = r.circle(x1 + k*25, y1+ p*25, 10);
								pawn.fig = fig;
								fig.id = count*100+pawn_no;
								pawn.inc_id = pawn_no;
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

	getuuid();
}

function getuuid() {
	var uuidContent = document.getElementById('uuidDiv');
	uuidContent.innerHTML = "Please wait till we fetch your player Id" ;
	setTimeout(function() {
		uuid = now.uuid;
		uuidContent.innerHTML = "Your player Id is set " + uuid ;
		setTimeout(function() {
			now.addPlayer(uuid);
		//	console.log(now.players_arr);
		},3000);

	},2000);
}

function play_game(){
	vals = [1,2,3,4,8];
	window.value = 0;
	if(values.length > 0 && ( free_hit != 1)){
		console.log("nothing free here");
		return;
	}
	console.log(now.turn);
	if(Number(uuid) != Number(now.players_arr[Number(now.turn)])) {
		console.log("wrong uuid" + uuid );
		console.log(now.players_arr);
		return;
	}
	now.get_val();
	var myScore = document.getElementById('score');
	myScore.innerHTML = "Dice is rolling on the server - good luck!!";
	setTimeout(function() {
			free_hit = 0;
			var server_val = now.vali;
			values.push(server_val);
        		myScore.innerHTML =server_val;
			if(server_val == 4 || server_val == 8) {
				free_hit = 1;
			}


	} ,3000);
}
