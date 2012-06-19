var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/"] = requestHandlers.index;
handle["/notif"] = requestHandlers.notif;
handle["/poke"] = requestHandlers.poke;
handle["/cb"] = requestHandlers.cb;
handle["/cb.js"] = requestHandlers.cbjs;
handle["/cb_new"] = requestHandlers.cb_new;
handle["/cb_new.js"] = requestHandlers.cbnewjs;
handle["/raphael.js"] = requestHandlers.raphaeljs;

var nowjs = require("now");
var everyone = nowjs.initialize(server.start(router.route, handle));
count = 1;
var notif_arr = [];

everyone.connected(function(){
	console.log(this.groupName);
	//to be got from mongoDB getNotifications
	this.now.counter = 0;
	//mongo DB per connection
	console.log(this.user.clientId);
	this.now.uuid = ++count;
	notif_arr[this.now.uuid] = 0;
});

everyone.disconnected(function(){
	console.log("Left: " + this.now.name);
});


everyone.now.update = function(pawn_id, att) {
	//console.log(pawn_id);
	everyone.now.updatePawn(pawn_id, att);
}

everyone.now.pokeMesg = function() { 
	console.log(notif_arr[this.now.uuid]);
	notif_arr[this.now.uuid] = notif_arr[this.now.uuid]+ 1;	
	console.log(this.now.email);
	console.log(notif_arr[this.now.uuid]);
	// get friend list of the uuid - returns list of uuids
	// increment the countter on the client side for that specific user
	everyone.now.receiveNotif(this.now.uuid, notif_arr[this.now.uuid]);
}