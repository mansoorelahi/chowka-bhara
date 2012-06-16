var http = require("http");
var url = require("url");

function start(route, handle) {
  function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;
        console.log("Request for " + pathname + " received.");

       // response.writeHead(200, {"Content-Type": "text/plain"});
	route(handle, pathname, response);

//	var content = route(handle, pathname)
  //      response.write(content);
    //    response.end();
  }

  var serve = http.createServer(onRequest);
  serve.listen(8081);
  console.log("Server has started.");
  return serve;
}

exports.start = start;
