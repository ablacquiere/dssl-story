var express = require('express')
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var router = express.Router();

var bodyParser = require('body-parser');

app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: false }));

//app.use(router);
//app.set('game', path.join(__dirname,'game'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/static/index.html');
});
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'html');
//
// router.get('/', function(req, res) {
//   res.render('index');
// });
app.use(express.static(__dirname+"/game"));
app.use(express.static(__dirname+"/story"));

app.get('/game', function(req, res){
  res.sendFile(__dirname + '/game/index.html');
});

app.get('/story', function(req, res){
  res.sendFile(__dirname + '/story/index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
