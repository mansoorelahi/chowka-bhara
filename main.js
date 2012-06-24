var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/"] = requestHandlers.index;
handle["/cb.js"] = requestHandlers.cbjs;
handle["/raphael.js"] = requestHandlers.raphaeljs;
handle["/jquery.url.js"] = requestHandlers.jqueryurljs;
handle["/jquery.min.js"] = requestHandlers.jqueryminjs;
handle["/jquery_popup.js"] = requestHandlers.jquerypopupjs;
handle["/main.css"] = requestHandlers.css;
handle["/game"] = requestHandlers.game;
handle["/favicon.ico"] = requestHandlers.favicon;
handle["/ajax-loading.gif"] = requestHandlers.loading_image;
handle["/README"] = requestHandlers.README;

var nowjs = require("now");
var everyone = nowjs.initialize(server.start(router.route, handle));
// Declare a list of server rooms
everyone.now.serverRoomsList = {
  1:'Room 1',2:'Room 2',3:'Room 3',
  4:'Room 4',5:'Room 5',6:'Room 6',
  7:'Room 7',8:'Room 8',9:'Room 9',
  10:'Room 10'
};
count = 1;
var max_group_count = 4;

function log_prefix(){
  return "cb_server:" + new Date() + ":";
}

everyone.connected(function(){
	//to be got from mongoDB getNotifications
	this.now.counter = 0;
	//mongo DB per connection
	console.log(log_prefix() + "User client id is " + this.user.clientId);
	this.now.uuid = ++count;
  this.now.moderator = false;
});

everyone.disconnected(function(){
  nowjs.getGroup(this.now.serverRoom).locked = false;
	console.log(log_prefix() + this.now.name + " disconnected from the Room " + this.now.serverRoom);
});

nowjs.on('newgroup', function (group) {
  group.now.players_arr = [];
  group.now.turn = 0;
});

// Send message to everyone in the users group
everyone.now.distributeMessage = function(message){
  var group = nowjs.getGroup(this.now.serverRoom);
  group.now.receiveMessage(this.now.name, message);
}

// Send message to everyone in the users group
everyone.now.distributeGamePlay = function(message){
  var group = nowjs.getGroup(this.now.serverRoom);
  group.now.receiveGamePlay(message);
}

everyone.now.changeRoom = function(newRoom, callback){
  console.log(log_prefix() + this.now.name + " tried Room " + newRoom);
  var oldRoom = this.now.serverRoom;

  //if old room is not null; then leave the old room
  if(oldRoom){
    var oldGroup = nowjs.getGroup(oldRoom);
    oldGroup.removeUser(this.user.clientId);
  }

  // join the new room
  var newGroup = nowjs.getGroup(newRoom);
  if(newGroup.locked == undefined)
    newGroup.locked = false;
  
  // check max group count for current group
  var groupCount = 0;
  newGroup.count(function (ct) {
  	groupCount = ct;
	});

  if(groupCount < max_group_count && !newGroup.locked){
  	newGroup.addUser(this.user.clientId);
	  this.now.serverRoom = newRoom;
	  console.log(log_prefix() + this.now.name + " joined Room " + this.now.serverRoom);

    // make the first player, moderator of the current group
    if(groupCount == 0){
      newGroup.moderator = this.user.clientId;
      this.now.moderator = true;
      console.log(log_prefix() + this.now.name + " is the moderator of Room " + this.now.serverRoom);
    }else if(groupCount == (max_group_count - 1)){
      newGroup.locked = true; // last player, rooms full
    }
    callback(true);
  }else{
    console.log(log_prefix() + this.now.name + " entry denied to Room " + this.now.serverRoom + " - duh its locked!!!");
    callback(false);
  }  
}

everyone.now.groupModerator = function(callback){
  callback(nowjs.getGroup(this.now.serverRoom).moderator);
}

everyone.now.userClientId = function(callback){
  callback(this.user.clientId);
}

everyone.now.getGroupUsers = function(callback){
  everyone.getUsers(function (users){ 
    callback(users);
  });
}

everyone.now.removeUserByModerator = function(user_id, callback){
  if(this.now.moderator && user_id != this.user.clientId){
    var group = nowjs.getGroup(this.now.serverRoom);
    group.hasClient(user_id, function (bool) { 
      if (bool){
        group.removeUser(user_id);
        callback(user_id);
      }
    });
  }
}

everyone.now.getUserNameById = function(user_id, callback){
  this.getGroups(function (groups) {
    if(groups[0]['users'] != undefined)
      callback(nowjs.getGroup(groups[0])['users'][user_id]['now']['name']);
  });
}

everyone.now.leaveRoom = function(callback){
  nowjs.getGroup(this.now.serverRoom).locked = false;
  nowjs.getGroup(this.now.serverRoom).removeUser(this.user.clientId);
  callback();
}

// lock room if the user is moderator with atleast 2 players
everyone.now.lockRoom = function(callback){
  var moderator = this.now.moderator;
  var group = nowjs.getGroup(this.now.serverRoom);
  group.count(function (count) {
    if(moderator && count > 1 && count < (max_group_count + 1)){
      group.locked = true;
    }
    callback(group.locked);
  });
}

everyone.now.groupCount = function(group_id, callback){
  nowjs.getGroup(group_id).count(function (count) {
    callback(count);
  });
}

everyone.now.getRoomStatus = function(group_id, callback){
  callback(nowjs.getGroup(group_id).locked);
}

Array.prototype.findIndex = function(value){
  var ctr = -1;
  for (var i=0; i < this.length; i++) {
    if (this[i] == value) {
      return i;
    }
  }
  return ctr;
}

everyone.now.update = function(pawn_id, att, from_id, to_id) {
	var group = nowjs.getGroup(this.now.serverRoom);
  group.now.updatePawn(pawn_id, att, from_id, to_id);
}

everyone.now.turn_change = function(){
  var group = nowjs.getGroup(this.now.serverRoom);
  var groupCount = 0;
  group.count(function(count){
    groupCount = count;
  });
  group.now.turn = group.now.turn + 1;
  group.now.turn = group.now.turn % groupCount;
  this.now.distributeGamePlay(this.now.name + "'s turn completed");
  var users = group['users'];
  for(user in users){
    if(group['users'][user]['now']['uuid'] == group.now.players_arr[group.now.turn]){
      this.now.distributeGamePlay(group['users'][user]['now']['name'] + "'s turn to play");
      break;
    }
  }
}

everyone.now.addPlayer = function(pid) {
	var group = nowjs.getGroup(this.now.serverRoom);
  group.now.players_arr.push(pid);
	console.log(group.now.players_arr);
}

everyone.now.get_val = function() {
  //get array check here itself.
	var possible_values = [1,2,3,4,8];
	_val = Math.floor(Math.random()*10);
	while(!(possible_values.findIndex(_val)>=0)) {
		_val = Math.floor(Math.random()*10);
	}
	everyone.now.vali = _val;
  this.now.distributeGamePlay(this.now.name + " rolled " + everyone.now.vali +
   ", " + this.now.name + " to move");
}