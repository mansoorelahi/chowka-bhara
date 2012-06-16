var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/"] = requestHandlers.index;
handle["/notif"] = requestHandlers.notif;
handle["/poke"] = requestHandlers.poke;
handle["/cb"] = requestHandlers.cb;
handle["/cb.js"] = requestHandlers.cbjs;
handle["/raphael.js"] = requestHandlers.raphaeljs;

//server.start(router.route, handle);

var everyone = require("now").initialize(server.start(router.route, handle));

count = 1;

var notif_arr = [];

everyone.connected(function(){
	//to be got from mongoDB getNotifications
	this.now.counter = 0;
	//mongo DB per connection
	console.log(this.user.clientId);
	this.now.uuid = ++count;
	notif_arr[this.now.uuid] = 0;
//	while(1) {

//	setInterval(everyone.now.receiveNotif(this.now.uuid, this.now.counter),100);	
//	}
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
		//everyone.now.receiveNotif(this.now.uuid, this.now.counter);
		// get friend list of the uuid - returns list of uuids
		// increment the countter on the client side for that specific user
		everyone.now.receiveNotif(this.now.uuid, notif_arr[this.now.uuid]);

}

