var fs = require('fs');
var url = require('url');
var poker = 0;
var server = require('http').createServer(function(req, response){

				if(req.method=='GET') {
				var url_parts = url.parse(req.url,true);
				poker = url_parts.query['poker'];
				console.log(poker);
				}
				fs.readFile('comments.html', function(err, data){
						response.writeHead(200, {'Content-Type':'text/html'});
						response.write(data);
						response.end();
						});

				});
server.listen(8081);
				//console.log(url_parts.query['poker']);
var everyone = require("now").initialize(server);

count = 1;

var notif_arr = [];

everyone.connected(function(){
	//to be got from mongoDB getNotifications
	this.now.counter = 0;
	//mongo DB per connection
	console.log(this.user.clientId);
	this.now.uuid = ++count;
	notif_arr[this.now.uuid] = 0;
	if(poker)
	{
		this.now.poker = 1;
	}

	console.log(this.now.poker);
//	while(1) {

//	setInterval(everyone.now.receiveNotif(this.now.uuid, this.now.counter),100);	
//	}
	});

everyone.disconnected(function(){
		console.log("Left: " + this.now.name);
				});


everyone.now.pokeMesg = function() { 
		console.log(notif_arr[this.now.uuid]);
console.log(poker);
		notif_arr[this.now.uuid] = notif_arr[this.now.uuid]+ 1;	
		console.log(notif_arr[this.now.uuid]);
		//everyone.now.receiveNotif(this.now.uuid, this.now.counter);
		everyone.now.receiveNotif(this.now.uuid, notif_arr[this.now.uuid]);

}

	
