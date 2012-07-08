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
	this.is_gatti = 0;
	this.partner_pawn_id = 0;
}

function Box() {
	this.occupied = 0;
	this.occupied_player = new Array();
	this.has_two = 0;
	this.has_three = 0;

}

function Gatti() {

	this.pawn1 = undefined;
	this.pawn2 = undefined;
	this.id = 0;
	this.line = undefined;
//	this.move(x, y) {
		//change pawn1 and pawn2 attrs simultaneously 
//	};

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
	y = Math.floor(id%10)*box_width + Math.floor(((id%10) - 1)*2);
	x = Math.floor(id/10)*box_width + Math.floor(((id/10) - 1)*2) + left_width;

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

function clear_from_box(from_box) {
	if(safe_houses.findIndex(from_box)>=0) {
                console.log("_do_nothing for safe houses");
                return true;
        }

	if(window.boxes[from_box].occupied_player.length == 1) {
		window.boxes[from_box].occupied = 0;
		window.boxes[from_box].occupied_player.splice(0,1);
		window.boxes[from_box].has_two = 0;
	}
}

function isPairing(pawn_moved, from_box, to_box) {
	var pawn1 = getPawnById(pawn_moved);
	var pawn2 = getPawnById(boxes[to_box].occupied_player[0]);
	console.log("inside");
	console.log(boxes[to_box]);
	if(pawn1.home == pawn2.home)
	{
//		boxes[to_box].occupied_player.push(pawn_moved);
	
		//create bond
		var x1 = pawn1.fig.attrs.cx;
		var x2 = pawn2.fig.attrs.cx;
		var y1 = pawn1.fig.attrs.cy;
		var y2 = pawn2.fig.attrs.cy;
		var gatti_path_str = "M"+x1+" "+y1+"L"+x2+ " "+y2;
		var gatti_fig = window.r.path(gatti_path_str);

		boxes[to_box].has_two = 1;

		//update properties
		pawn1.is_gatti = 1;
		pawn2.is_gatti = 1;
console.log(pawn2);
console.log(pawn1);
		pawn1.partner_pawn_id = pawn2.fig.id;
		pawn2.partner_pawn_id = pawn1.fig.id;

		pawn1.gatti_line = gatti_fig;
		pawn2.gatti_line = gatti_fig;

		return true;
	}
	else
	{
		return false;
	}
}

//controvercial rule - need clarification
function pair_break (pawn_moved, from_box, to_box) {

	return false;
}

function c_kododu(pawn_moved, to_box) {

	return false;
}

function gatti_attack(from_box, to_box) {
	//returnHome( getPawnById(boxes[to_box].occupied_player[0] );
	//returnHome( getPawnById(boxes[to_box].occupied_player[1] );

	
	return false;

}

function isAttackSuccessful(pawn_moved, from_box, to_box) {
	console.log("yaake!");
	console.log(boxes[from_box]);	
	console.log(boxes[to_box]);	
	if(boxes[from_box].has_two == 1 && boxes[to_box].has_two == 1) {
		return gatti_attack(from_box, to_box);
	}

	if(boxes[to_box].has_two == 1)
	{
		//C-kododu - special case
		return c_kododu(pawn_moved, to_box);
		//return false;
	}
	else
	{	
		//change the occupied_player 
		pawn_attacked = getPawnById(boxes[to_box].occupied_player[0]);
		console.log(pawn_attacked);
		returnHome(pawn_attacked);
		boxes[to_box].occupied_player[0] = pawn_moved;
		free_hit =1;
		return true;
	}
}

//clear from_box wherever its returning true
function isLegal(pawn_moved, from_id, to_id, value) {
	gatti = typeof gatti !== 'undefined' ? gatti : 0;
	var player_id = getPlayerId(pawn_moved);
	var from_indx = players[player_id-1].path.findIndex(from_id);
	var to_indx = players[player_id-1].path.findIndex(to_id);

//gatti in the way - illegal - TODO

//no attack and no pairing in safe house
	if(safe_houses.findIndex(to_id)>=0) {
                console.log("_do_nothing");
		//clear_from_box(from_box);
                return true;
        }
//if its not players turn
	if(player_id != (now.turn + 1)) {
                return false;
        }

//if player has not killed anyone - he is not allowed in the inner square
	var inner_square = [42, 43, 44, 34, 24, 23, 22, 32, 33];
	if((inner_square.findIndex(to_id) >= 0 ) && (players[player_id-1].has_killed == 0)) {
		return false;
	}

	var pawn = getPawnById(pawn_moved);
//value should be proper for normal pawn movement 
	if(((to_indx - from_indx) != value) && (pawn.is_gatti != 1)){
		return false;
	}
//only multiples of 2 allowed for gatti movement
	if((pawn.is_gatti == 1) && (value % 2 !=0)) {
		return false;
	}

//if the to_box is occupied - check for pairing and attack else its a legal move
	if(window.boxes[to_id].occupied != 0) {	
		//check if its a gatti
		console.log("here");
		if(isPairing(pawn_moved, from_id, to_id))
		{
			//clear_from_box(from_box);
			return true;
		}
		//if its not pairing - then it should be an attack
		if(isAttackSuccessful(pawn_moved, from_id, to_id))
		{
			console.log("came here");
			//clear_from_box(from_box);
			players[player_id-1].has_killed = 1;
			return true;
		}
		else //in this case - attack was not successful for gatti in to_box - special case 
		{
			return false;
		}
	}
	else
	{
		console.log("here - not good");
		//clear the from_box - important!
		//clear_from_box(from_box);

		//instead of push - change the first element in occupied_player
		window.boxes[to_id].occupied = 1;
		window.boxes[to_id].occupied_player[0] = pawn_moved;

		if(pawn.is_gatti) {
//			partner_pawn = getPawnById(this_pawn.partner_pawn_id);
///			partner_pawn.fig.attr(att);
			window.boxes[to_id].has_two = 1;
		}
				
		console.log(window.boxes[to_id]);

		return true;
	}
}

now.updatePawn = function(pawn_id, att, from_id, to_id, value) {
//only if pawn not moved already
	if(!is_pawn_moved)
	{

		var pawn = getPawnById(pawn_id);
		var old_att = pawn.fig.attr;
		pawn.fig.attr(att);
		if(isLegal(pawn_id, from_id, to_id, value)) {
			pawn.currentBox = to_id;
			pawn.fig.attr(att);
			clear_from_box(from_id);
			if(pawn.is_gatti) {

				var box_dim = getBoxDim(to_id);

				var gatti_att = {cx: (box_dim.x + 35) - 15, cy: box_dim.y + 35}
				pawn.fig.attr(gatti_att);

				var partner_pawn = getPawnById(Number(this_pawn.partner_pawn_id));
				var partner_att = {cx: (box_dim.x + 35) + 15, cy: box_dim.y + 35}
				partner_pawn.fig.attr(partner_att);

				var x2 = pawn.fig.attrs.cx + 30;
				var gatti_path_str = "M"+pawn.fig.attrs.cx+" "+pawn.fig.attrs.cy+"L"+x2+ " "+pawn.fig.attrs.cy;
				//var gatti_fig = window.r.path(gatti_path_str);
				pawn.gatti_line.attr({path : gatti_path_str});	
				partner_pawn.gatti_line.attr({path: gatti_path_str});	

			}
		}
		else {
			pawn.fig.attr(old_att);	
		}
	}
	is_pawn_moved = 0;
}

function spliceMe(pawn_moved, from_id, to_id){
	var player_id = getPlayerId(pawn_moved);
	var move = (players[player_id-1].path.findIndex(to_id) - players[player_id-1].path.findIndex(from_id));
	var spliced_val = [];
	for (v in values){
		if(move == values[v]){
			spliced_val = values.splice(v, 1);
			window.value = spliced_val[0];
		}
	}
}

var is_pawn_moved = 0;
var pawns = [];
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
var box_width = 75;
var r;

function loadCB() {
	r = Raphael("holder", 680, 580);	
	var dragger = function () {
			this.ox = this.type == "rect" ? this.attr("x") : this.attr("cx");
			this.oy = this.type == "rect" ? this.attr("y") : this.attr("cy");
			this.animate({"fill-opacity": .2}, 500);
	},
		move = function (dx, dy) {
				var att = this.type == "rect" ? {x: this.ox + dx, y: this.oy + dy} : {cx: this.ox + dx, cy: this.oy + dy};
				this.attr(att);
				this_pawn = getPawnById(this.id);
				if(this_pawn.is_gatti) {
					var gatti_att = {cx: this.attrs.cx - 30, cy: this.attrs.cy}
					this.attr(gatti_att);
					var partner_pawn = getPawnById(Number(this_pawn.partner_pawn_id));
					var partner_att = {cx: this.attrs.cx + 30, cy: this.attrs.cy}
					partner_pawn.fig.attr(partner_att);

					var x2 = this.attrs.cx + 30;
					var gatti_path_str = "M"+this.attrs.cx+" "+this.attrs.cy+"L"+x2+ " "+this.attrs.cy;
			                //var gatti_fig = window.r.path(gatti_path_str);
					this_pawn.gatti_line.attr({path : gatti_path_str});	
					partner_pawn.gatti_line.attr({path: gatti_path_str});	

				}
				r.safari();
		},
		up = function () {
				this.animate({"fill-opacity": 1}, 500);
				from_id = getBoxId(this.ox, this.oy);
				to_id = getBoxId(this.attrs.cx , this.attrs.cy);

				this_pawn = getPawnById(this.id);
				
				if(from_id == to_id) {
					var att =  this.type == "rect" ? {x: this.ox + dx, y: this.oy + dy} : {cx: this.attrs.cx, cy: this.attrs.cy};
                                        this_pawn.currentBox = to_id;
					console.log("wtf!!");
					now.update(this.id, att, from_id, to_id);
					return;
				}
				spliceMe(this.id, from_id, to_id);
				console.log(boxes[to_id]);
				if(!isLegal(this.id, from_id, to_id, value))
				{
					var att = this.type == "rect" ? {x: this.ox, y: this.oy} : {cx: this.ox , cy: this.oy};
					this.attr(att);
					r.safari();
					this_pawn.currentBox = from_id;
					console.log("illegal!!");

					if(this_pawn.is_gatti) {
						var gatti_att = {cx: this.attrs.ox - 30, cy: this.attrs.oy}
						this.attr(gatti_att);
						var partner_pawn = getPawnById(Number(this_pawn.partner_pawn_id));
						var partner_att = {cx: this.attrs.ox + 30, cy: this.attrs.oy}
						partner_pawn.fig.attr(partner_att);

						var x2 = this.attrs.ox + 30;
						var gatti_path_str = "M"+this.attrs.ox+" "+this.attrs.oy+"L"+x2+ " "+this.attrs.oy;
						//var gatti_fig = window.r.path(gatti_path_str);
						this_pawn.gatti_line.attr({path : gatti_path_str});	
						partner_pawn.gatti_line.attr({path: gatti_path_str});	

					}


				}
				else
				{
					var att =  this.type == "rect" ? {x: this.ox + dx, y: this.oy + dy} : {cx: this.attrs.cx, cy: this.attrs.cy};
					this.attr(att);
					//this_pawn.fig.attr(att); //not needed i guess
					this_pawn = getPawnById(this.id);
					if(this_pawn.is_gatti) {

						var box_dim = getBoxDim(to_id);

						var gatti_att = {cx: (box_dim.x + 35) - 15, cy: box_dim.y + 35}
						this.attr(gatti_att);

						var partner_pawn = getPawnById(Number(this_pawn.partner_pawn_id));
						var partner_att = {cx: (box_dim.x + 35) + 15, cy: box_dim.y + 35}
						partner_pawn.fig.attr(partner_att);

						var x2 = this.attrs.cx + 30;
						var gatti_path_str = "M"+this.attrs.cx+" "+this.attrs.cy+"L"+x2+ " "+this.attrs.cy;
						//var gatti_fig = window.r.path(gatti_path_str);
						this_pawn.gatti_line.attr({path : gatti_path_str});	
						partner_pawn.gatti_line.attr({path: gatti_path_str});	

					}

					this_pawn.currentBox = to_id;

					clear_from_box(from_id);
					//make the pawn moved to true so that it wont get moved again
					is_pawn_moved = 1;
					now.update(this.id, att, from_id, to_id, value);

					if(values.length <= 0) {
						values = [];
						now.turn_change();
						value = 0;
					}else{
						updateDiceStackUI();
					}
				}
			
		};

	count = 0;
	//create the basic layout
	for(i = 1 ; i <= 5 ; i++)
	{
		for(j = 1; j <= 5; j++)
		{
			var box = new Box(); 
			var rect = r.rect(left_width + i * box_width + i * 2, j * box_width + j * 2, box_width, box_width, 2);
			box.id = i*10 + j;
			box.rect = rect;
			
			boxes[i*10 + j] = box;

			if( ((i == 1 || i == 5 || i == 3) && (j == 3) || (j == 1 || j == 5 || j == 3) && (i == 3)))
			{
				var x1 = left_width + i*box_width + i * 2;
				var y1 = j * box_width + j *2;
				var x2 = left_width + i*box_width + i * 2 + box_width;
				var y2 = j * box_width + j *2 + box_width;
				var path_str = "M"+x1+" "+y1+"L"+x2+ " "+y2;
				r.path(path_str);
				
				x1 = x1+box_width;
				x2 = x2-box_width;
				path_str = "M"+x1+" "+y1+"L"+x2+ " "+y2;
				r.path(path_str);
				//for a 2 player game.. it shud be different			
				if(!(i==3 && j==3))
				{
					count = count +1;
					//create pawns
					x1 = x1 - box_width;

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
	var count = 0, legend_index = 0, legend_radius = 12;
	for (var i = 0, ii = pawns.length; i < ii; i++) {
			var color;
			if(!(count%4))
			{
				color = Raphael.getColor();
				count = 0;

				// create pawns legend
				if(legend_index == 0) {
					r.circle(left_width + 50, 268, legend_radius).attr("fill", color);	
					l_text_l = r.text(left_width + 25, 300, "")
          	.attr({"fill": "#000", "font-size": legend_font, "font-family": "Arial"});				
				}
				if(legend_index == 1){
					r.circle(left_width + 268, 50, legend_radius).attr("fill", color);
					l_text_t = r.text(left_width + 310, 50, "")
          	.attr({"fill": "#000", "font-size": legend_font, "font-family": "Arial"});
				}
				if(legend_index == 2){
					r.circle(left_width + 268, 485, legend_radius).attr("fill", color);	
					l_text_b = r.text(left_width + 310, 485, "")
          	.attr({"fill": "#000", "font-size": legend_font, "font-family": "Arial"});				
				} 
				if(legend_index == 3){
					r.circle(left_width + 485, 268, legend_radius).attr("fill", color);
					l_text_r = r.text(left_width + 490, 300, "")
          	.attr({"fill": "#000", "font-size": legend_font, "font-family": "Arial"});
				}
				legend_index += 1;
			}
			count = count + 1;
			pawns[i].fig.attr({fill: color, stroke: color, "fill-opacity": 2, "stroke-width": 2, cursor: "move"});
			pawns[i].fig.drag(move, dragger, up);
	}
	create_players(4);
	getuuid();
}

function getuuid() {
	setTimeout(function() {
		uuid = now.uuid;
		now.distributeGamePlay("Thanks for your patience... " + now.name +
			" is all set to begin play, Moderator starts first");
		setTimeout(function() {
			now.addPlayer(uuid);
			set_legends();
		}, 2000);
	}, 1000);
}

var user_x = 0;
var legend_completed = false;
var l_text_t, l_text_b, l_text_l, l_text_r;
var legend_name = 8, legend_font = 12;
function set_legends(){
  now.getGroupUsers(function(group_users){
  	var users = group_users;
  	if(users != undefined){
			if(users.length > 0 && !legend_completed){
			  now.getUserNameById(users[user_x], function(user_name){
				  var name = user_name.substring(0, legend_name).toLowerCase();
				  switch (user_x){
				    case 0:
				      l_text_t.attr("text", name);
				      user_x += 1;
				      break;
				    case 1:         
				      l_text_r.attr("text", name);
				      user_x += 1;
				      break;
				    case 2:
				      l_text_b.attr("text", name);
				      break;
				    case 3:
				      l_text_l.attr("text", name);
				      user_x += 1;
				      legend_completed = true;
				      break;
				    default: break;
				  }
			  });
			}
			if(user_x < 4 && !legend_completed){
		  	setTimeout(function(){
		  		set_legends();
		  	}, 3000);
		  }
		}else if(!legend_completed){
			setTimeout(function(){
	  		set_legends();
	  	}, 3000);
		}
  });

  // check room status if its locked or not
  now.getRoomStatus(undefined, function(status){
  	legend_completed = status;
  });
}

function reset_legends(){
	var loading_name = "";
	legend_completed = false; user_x = 0;
	if(l_text_t != undefined)
		l_text_t.attr("text", loading_name);
	if(l_text_r != undefined)
		l_text_r.attr("text", loading_name);
	if(l_text_b != undefined)
		l_text_b.attr("text", loading_name);
	if(l_text_l != undefined)
		l_text_l.attr("text", loading_name);
	set_legends();
}

var prev_hit = 0;
function play_game(){
	window.value = 0;
	if(values.length > 0 && free_hit != 1){
		console.log("nothing free here");
		return;
	}
	if(Number(uuid) != Number(now.players_arr[Number(now.turn)])) {
		console.log("wrong uuid" + uuid );
		console.log(now.players_arr);
		return;
	}
	now.get_val(values);
	var myScore = document.getElementById('score');
	myScore.innerHTML = "Dice is rolling on the server - good luck!!!";
	var myDice = document.getElementById('role_dice');
	myDice.disabled = "true";
	var myDiceStack = document.getElementById('dice_stack');
	setTimeout(function() {
			free_hit = 0;
			var server_val = now.vali;
			values.push(server_val);
      myScore.innerHTML = "You rolled " + server_val;
			if(server_val == 4 || server_val == 8) {
				free_hit = 1;
				myDice.disabled = "";
				now.distributeGamePlay(this.now.name + " gets a free hit - rolled " + server_val);
			}
			if(values.length > 0 && free_hit == 1){
				var ds = myDiceStack.innerHTML + "<div class='dice_stack'>" + server_val + "</div>"
				myDiceStack.innerHTML = ds;
			}else{
				if(prev_hit == 0)
					myDiceStack.innerHTML = "";
				else{
					var ds = myDiceStack.innerHTML + "<div class='dice_stack'>" + server_val + "</div>"
					myDiceStack.innerHTML = ds;
				}
			}
			prev_hit = free_hit;
			
	}, 3000);
}

function updateDiceStackUI(){
	var myDiceStack = document.getElementById('dice_stack');
	var ds = "";
	var ds_index = values.length;
	while(ds_index > 0){
		ds += "<div class='dice_stack'>" + values[ds_index - 1] + "</div>"
		ds_index -= 1;
	}
	myDiceStack.innerHTML = ds;
}