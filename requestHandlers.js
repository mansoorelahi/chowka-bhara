var fs = require('fs');
function notif(response) {
  console.log("Request handler 'notif' was called.");
fs.readFile('disp.html', function(err, data){
						response.writeHead(200, {'Content-Type':'text/html'});
						response.write(data);
						response.end();
						});
}

function cb(response) {
  console.log("Request handler 'cb' was called.");
fs.readFile('first_cut.html', function(err, data){
						response.writeHead(200, {'Content-Type':'text/html'});
						response.write(data);
						response.end();
						});
}

function cb_new(response) {
  console.log("Request handler 'cb' was called.");
fs.readFile('second_cut.html', function(err, data){
						response.writeHead(200, {'Content-Type':'text/html'});
						response.write(data);
						response.end();
						});
}
function poke(response) {
  console.log("Request handler 'poke' was called.");
fs.readFile('poke.html', function(err, data){
						response.writeHead(200, {'Content-Type':'text/html'});
						response.write(data);
						response.end();
						});
}

function cbnewjs(response) {
  console.log("Request handler 'cbjs' was called.");
fs.readFile('cb_new.js', function(err, data){
						response.writeHead(200, {'Content-Type':'text/html'});
						response.write(data);
						response.end();
						});
}


function cbjs(response) {
  console.log("Request handler 'cbjs' was called.");
fs.readFile('cb.js', function(err, data){
						response.writeHead(200, {'Content-Type':'text/html'});
						response.write(data);
						response.end();
						});
}
function raphaeljs(response) {
  console.log("Request handler 'raphael' was called.");
fs.readFile('raphael.js', function(err, data){
						response.writeHead(200, {'Content-Type':'text/html'});
						response.write(data);
						response.end();
						});
}
exports.raphaeljs = raphaeljs;
exports.cbjs = cbjs;
exports.cbnewjs = cbnewjs;
exports.cb = cb;
exports.cb_new = cb_new;
exports.notif = notif;
exports.poke = poke;
