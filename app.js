
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var http = require('http');
var fs = require('fs');
var mime = require('mime');


var chatServer = require('./lib/chat_server.js');
chatServer.listen(server);

var CONSTANTS = require('./constants');
var SERVERCONFIG = CONSTANTS.SERVERCONFIG;
/********** written by me **********/

var cache = [];

function send404(response)
{
  response.writeHead(404,{'Content-Type':'text/plain'});
  response.write('Error 404: resource not found.');
  response.end();
}

function sendFile(response, filePath, fileContents) {
  response.writeHead(
      200,
      {"content-type": mime.lookup(path.basename(filePath))}
  );
  response.end(fileContents);
}


function serveStatic(response,cache,absPath)
{
  if(cache[absPath])
  {
    sendFile(response,absPath,cache[absPath]);
  }
  else{

    fs.exists(absPath,function(exists){

      if(exists)
      {
          fs.readFile(absPath,function(err,data){

            if(err)
            {
              send404(response);
            }
            else
            {
              cache[absPath] = data;

              sendFile(response,absPath,data);
            }
          });
      }
      else{
        send404(response);
      }
    });
  }
}


var server = http.createServer(function(request,response){

  var filePath = false;

  if(request.url == '/')
  {
    filePath = 'public/index.html';
  }
  else{
    filePath = 'public'+request.url;
  }

  var absPath = './'+filePath;

  serveStatic(response,cache,absPath);
});

server.listen(SERVERCONFIG.SERVER.PORT,function(){
  console.log("Server started on port "+SERVERCONFIG.SERVER.PORT);
});



// var routes = require('./routes/index');
// var users = require('./routes/users');
//
// var app = express();
//
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
//
// // uncomment after placing your favicon in /public
// //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
//
// // app.use('/', routes);
// // app.use('/users', users);
//
//
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
//
// // error handlers
//
// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }
//
// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });

//module.exports = app;
