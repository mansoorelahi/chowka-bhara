var fs = require('fs');
function favicon(response) {
  console.log("cb_server:" + new Date() + ":Request handler 'favicon' was called.");
	fs.readFile('favicon.ico', function(err, data){
		response.writeHead(200, {'Content-Type':'text/html'});
		response.write(data);
		response.end();
	});
}

function css(response) {
  console.log("cb_server:" + new Date() + ":Request handler 'css' was called.");
	fs.readFile('main.css', function(err, data){
		response.writeHead(200, {'Content-Type':'text/css'});
		response.write(data);
		response.end();
	});
}

function index(response) {
  console.log("cb_server:" + new Date() + ":Request handler 'index' was called.");
	fs.readFile('index.html', function(err, data){
		response.writeHead(200, {'Content-Type':'text/html'});
		response.write(data);
		response.end();
	});
}

function game(response) {
  console.log("cb_server:" + new Date() + ":Request handler 'game' was called.");
	fs.readFile('game.html', function(err, data){
		response.writeHead(200, {'Content-Type':'text/html'});
		response.write(data);
		response.end();
	});
}

function cbjs(response) {
  console.log("cb_server:" + new Date() + ":Request handler 'cb' was called.");
	fs.readFile('cb.js', function(err, data){
		response.writeHead(200, {'Content-Type':'text/javascript'});
		response.write(data);
		response.end();
	});
}

function raphaeljs(response) {
  console.log("cb_server:" + new Date() + ":Request handler 'raphael' was called.");
	fs.readFile('raphael.js', function(err, data){
		response.writeHead(200, {'Content-Type':'text/javascript'});
		response.write(data);
		response.end();
	});
}

function jqueryurljs(response) {
  console.log("cb_server:" + new Date() + ":Request handler 'jbqueryurljs' was called.");
	fs.readFile('jquery.url.js', function(err, data){
		response.writeHead(200, {'Content-Type':'text/javascript'});
		response.write(data);
		response.end();
	});
}

exports.raphaeljs = raphaeljs;
exports.jqueryurljs = jqueryurljs;
exports.cbjs = cbjs;
exports.favicon = favicon;
exports.css = css;
exports.index = index;
exports.game = game;