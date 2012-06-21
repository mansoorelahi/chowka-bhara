var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/"] = requestHandlers.index;
handle["/cb.js"] = requestHandlers.cbjs;
handle["/raphael.js"] = requestHandlers.raphaeljs;
handle["/jquery.url.js"] = requestHandlers.jqueryurljs;
handle["/main.css"] = requestHandlers.css;
handle["/game"] = requestHandlers.game;
handle["/favicon.ico"] = requestHandlers.favicon;

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

everyone.connected(function(){
	//to be got from mongoDB getNotifications
	this.now.counter = 0;
	//mongo DB per connection
	console.log("cb_server:" + new Date() + ":User client id is " + this.user.clientId);
	this.now.uuid = ++count;
  this.now.moderator = false;
});

everyone.disconnected(function(){
	console.log("cb_server:" + new Date() + ":" + this.now.name + " disconnected from the Room " + this.now.serverRoom);
});

// Send message to everyone in the users group
everyone.now.distributeMessage = function(message){
  var group = nowjs.getGroup(this.now.serverRoom);
  group.now.receiveMessage(this.now.name, message);
}

everyone.now.changeRoom = function(newRoom){
  console.log("cb_server:" + new Date() + ":" + this.now.name + " tried Room " + newRoom);
  var oldRoom = this.now.serverRoom;

  //if old room is not null; then leave the old room
  if(oldRoom){
    var oldGroup = nowjs.getGroup(oldRoom);
    oldGroup.removeUser(this.user.clientId);
  }

  // join the new room
  var newGroup = nowjs.getGroup(newRoom);
  
  // check max group count for current group
  var groupCount = 0;
  newGroup.count(function (ct) {
  	groupCount = ct;
	});

  if(groupCount < max_group_count){
  	newGroup.addUser(this.user.clientId);
	  this.now.serverRoom = newRoom;
	  console.log("cb_server:" + new Date() + ":" + this.now.name + " joined Room " + this.now.serverRoom);

    // make the first player, moderator of the current group
    if(groupCount == 0){
      newGroup.moderator = this.user.clientId;
      this.now.moderator = true;
      console.log("cb_server:" + new Date() + ":" + this.now.name + " is the moderator of Room " + this.now.serverRoom);
    }
  }  
}

everyone.now.update = function(pawn_id, att) {
	everyone.now.updatePawn(pawn_id, att);
}

everyone.now.groupModerator = function(group_id, callback){
  callback(nowjs.getGroup(group_id).moderator);
}

everyone.now.userClientId = function(callback){
  callback(this.user.clientId);
}

everyone.now.getGroupUsers = function(group_id, callback){
  everyone.getUsers(function (users){ 
    callback(users);
  });
}

everyone.now.removeUserByModerator = function(group_id, user_id, callback){
  if(this.now.moderator && user_id != this.user.clientId){
    var group = nowjs.getGroup(group_id);
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

everyone.now.leaveRoom = function(group_id, callback){
  nowjs.getGroup(group_id).removeUser(this.user.clientId);
  callback();
}