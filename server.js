var http = require("http");
var url = require("url");
var port = 8081;

function start(route, handle) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("cb_server:" + new Date() + ":Request for " + pathname + " received.");
    route(handle, pathname, response);
  }

  var serve = http.createServer(onRequest);
  serve.listen(port);
  console.log("cb_server:" + new Date() + ":Started server at port " + port);
  return serve;
}

exports.start = start;
