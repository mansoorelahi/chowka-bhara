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

var player_a_boxes = new Array();
var player_b_boxes = new Array();

var player_a_pawns = 0;
var player_b_pawns = 0;

var player_a_turn = 0;
var player_b_turn = 0;

//var path = [6,5,4,3,2,1,0,7,8,9,10,11,12,13];

function Box () {
	this.pawns_inside = 5;
	this.pawns = new Array();
	this.figr = undefined;
	this.center_x = 0;
	this.center_y = 0;
};

function  randomXToY(minVal,maxVal,floatVal)
{
	var randVal = minVal+(Math.random()*(maxVal-minVal));
	return typeof floatVal=='undefined'?Math.round(randVal):randVal.toFixed(floatVal);
}

function move_pawns(objid){
	var last_path = 0;
	objid = Number(objid);
	var old_objid = objid;
	if(Number(old_objid)>=7) {
		var pawns_in_box = player_b_boxes[old_objid-7].pawns.length;
		for(j=0; j < pawns_in_box ; j++){	
			//var path_indx = player_b_boxes.findIndex(this.id);
			//var path_indx = path.findIndex(objid);
			var new_x = 0;
			var new_y = 0;
			//var path_indx_1 = (Number(path_indx) + j +1)%14;
			objid = (objid + 1)%14;
			if(objid >= 7) {

				new_x = randomXToY(player_b_boxes[objid-7].center_x - 21, player_b_boxes[objid-7].center_x + 21);
				new_y = randomXToY(player_b_boxes[objid-7].center_y - 21, player_b_boxes[objid-7].center_y + 21);

				player_b_boxes[objid-7].pawns_inside = player_b_boxes.pawns_inside + 1;
				player_b_boxes[objid-7].pawns.push(player_b_boxes[old_objid-7].pawns[j]);
			} else {

				new_x = randomXToY(player_a_boxes[6-objid].center_x - 21, player_a_boxes[6-objid].center_x + 21);
				new_y = randomXToY(player_a_boxes[6-objid].center_y - 21, player_a_boxes[6-objid].center_y + 21);

				player_a_boxes[6-objid].pawns_inside = player_a_boxes.pawns_inside + 1;
				player_a_boxes[6-objid].pawns.push(player_b_boxes[old_objid-7].pawns[j]);
			}
// use old objid here
			player_b_boxes[old_objid - 7].pawns[j].attr({"fill":"black", "cx":new_x, "cy":new_y});
			last_path = objid;
		}
		player_b_boxes[old_objid - 7].pawns.splice(0,pawns_in_box);
	}else{
		var pawns_in_box = player_a_boxes[6-old_objid].pawns.length;
		for(j=0; j< pawns_in_box ; j++)
		{	
			//var path_indx = player_b_boxes.findIndex(this.id);
			//var path_indx = path.findIndex(objid);
			var new_x = 0;
			var new_y = 0;
			//var path_indx_1 = (Number(path_indx) + j +1)%14;
			objid = (objid +1)%14;
			if(objid >= 7) {

				new_x = randomXToY(player_b_boxes[objid-7].center_x - 21, player_b_boxes[objid-7].center_x + 21);
				new_y = randomXToY(player_b_boxes[objid-7].center_y - 21, player_b_boxes[objid-7].center_y + 21);

				player_b_boxes[objid-7].pawns_inside = player_b_boxes.pawns_inside + 1;
				player_b_boxes[objid-7].pawns.push(player_a_boxes[6-old_objid].pawns[j]);

			} else {

				new_x = randomXToY(player_a_boxes[6-objid].center_x - 21, player_a_boxes[6-objid].center_x + 21);
				new_y = randomXToY(player_a_boxes[6-objid].center_y - 21, player_a_boxes[6-objid].center_y + 21);

				player_a_boxes[6-objid].pawns_inside = player_a_boxes.pawns_inside + 1;
				player_a_boxes[6-objid].pawns.push(player_a_boxes[6-old_objid].pawns[j]);
			}
			player_a_boxes[6-old_objid].pawns[j].attr({"fill":"black", "cx":new_x, "cy":new_y});
			last_path = objid;
		}

		player_a_boxes[6-old_objid].pawns.splice(0,pawns_in_box);
	}
//here is the problem - last path should get its index from path
	last_path = (last_path+1)%14;
console.log("l"+last_path);
	if(Number(last_path)>=7) {
		if(player_b_boxes[last_path-7].pawns.length > 0) {
			move_pawns(Number(player_b_boxes[last_path-7].figr.id) + 7);
		}
		else {
		var count = 0;

		if(last_path==13) {
			count = player_a_boxes[6].pawns.length;
			create_win_pawns(player_a_boxes[6].pawns);
			player_a_boxes[6].pawns.splice(0,player_a_boxes[6].pawns.length);
		}else{
			count = player_b_boxes[(last_path + 1)-7].pawns.length;
//has to be -7 only since its counted for player_b_bix
			count += player_a_boxes[(last_path + 1)-7].pawns.length;

			create_win_pawns(player_b_boxes[(last_path + 1)-7].pawns);
			create_win_pawns(player_a_boxes[(last_path + 1)-7].pawns);

			player_b_boxes[(last_path +1)-7].pawns.splice(0, player_b_boxes[(last_path + 1)-7].pawns.length);
			player_a_boxes[(last_path + 1)-7].pawns.splice(0, player_a_boxes[(last_path + 1)-7].pawns.length);
		}

		if(player_a_turn == 1) { 
			window.player_a_pawns = window.player_a_pawns + count;	
		}else{
			window.player_b_pawns = window.player_b_pawns + count;
		}

		}
	}else {
//array index is different - id is diff :)
		if(player_a_boxes[6 - last_path].pawns.length>0) {
			move_pawns(Number(player_a_boxes[6 - last_path].figr.id));
		}
		else {
		var count = 0;
		if(last_path==6) {
			count = player_b_boxes[0].pawns.length;
			create_win_pawns(player_b_boxes[0].pawns);
			player_b_boxes[0].pawns.splice(0, player_b_boxes[0].pawns.length);
		}else{
//has to be 6 - something - since its counted for player_a_box
			count = player_a_boxes[6-(last_path + 1)].pawns.length;
			count += player_b_boxes[last_path + 1].pawns.length;

			create_win_pawns(player_a_boxes[6- (last_path + 1)].pawns);
			create_win_pawns(player_b_boxes[last_path + 1].pawns);
		
			player_b_boxes[last_path + 1].pawns.splice(0, player_b_boxes[last_path + 1].pawns.length);
			player_a_boxes[6 - (last_path + 1)].pawns.splice(0, player_a_boxes[6 - (last_path + 1)].pawns.length);

		}
		if(player_a_turn == 1) { 
			window.player_a_pawns = window.player_a_pawns + count;	
		}else{
			window.player_b_pawns = window.player_b_pawns + count;
		}

		}
	}

}

function create_win_pawns(pawns) {
	for(i=0 ; i < pawns.length; i++) {
		
		if(window.player_a_turn){
			pawns[i].attr({"cx":100 + (player_a_pawns + i)*20, "cy" : 300});
		}else {
			pawns[i].attr({"cx":100 + (player_b_pawns + i)*20, "cy" : 400});
		}
		
	}
}

function move_pawns_click() {
	if(this.id >= 7) {
		player_b_turn = 1;
		window.player_a_turn = 0;
	}else {
		window.player_a_turn = 1;
		player_b_turn = 0;
	}
	move_pawns(this.id);
}

window.onload = function () {
    var r = Raphael("holder", 800, 640);

    for(i=0;i<7;i++) {
	    var new_a_box = new Box();
	    r.rect(100+i*82, 80, 80, 80, 0);
	    for(j=0;j<5;j++){
		    var x = randomXToY(100+i*82+40-21, 100+i*82+40+21);	
		    var y = randomXToY(120-21, 120+21);	
		    new_a_box.pawns.push(r.ellipse(x , y,10, 10).attr({"fill":"red", "fill-opacity": .5}));
	    }
	    new_a_box.figr = r.ellipse(100+i*82+40, 120, 35, 35).attr({"fill":"grey", "fill-opacity": .2});
	    new_a_box.figr.id = 6 - i;
	    new_a_box.figr[0].id = Number(6-i);
	    new_a_box.figr.node.onclick = move_pawns_click;
	    new_a_box.center_x = 100+i*82+40;
	    new_a_box.center_y = 120;
	    player_a_boxes.push(new_a_box);

	    var new_b_box = new Box();
	    r.rect(100+i*82, 165, 80, 80, 0);
	    for(j=0;j<5;j++){
		    var x = randomXToY(100+i*82+40-21, 100+i*82+40+21);	
		    var y = randomXToY(205-21, 205+21);	
		    new_b_box.pawns.push(r.ellipse(x , y,10, 10).attr({"fill":"red", "fill-opacity": .5}));
	    }
	    //new_b_box.figr = r.ellipse(100+i*82+40, 120+80+5, 35, 35).attr({"fill":"grey", "fill-opacity": .2});
	    var circle = r.ellipse(100+i*82+40, 120+80+5, 35, 35).attr({"fill":"grey", "fill-opacity": .2});
	    //new_b_box.figr.node.onclick = move_pawns;
	    circle.node.onclick = move_pawns_click;
	    //new_b_box.figr.id = i;
	    circle.id = i;
	    circle[0].id = i+7;
	    new_b_box.figr = circle;
	    new_b_box.center_x = 100+i*82+40;
            new_b_box.center_y = 205;
	    player_b_boxes.push(new_b_box);

    }

//    r.rect(290, 180, 60, 40, 2);
//    r.ellipse(450, 100, 20, 20);
};
