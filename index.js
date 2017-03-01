var express = require('express')
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;

var db;

var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.post('/test', (req, res) => {
  db.collection('test').save(req.body, (err, result) => {
    console.log(req.body);
    if (err) return console.log(err)

    console.log('saved to database')

  })
})

MongoClient.connect('mongodb://ab-test:temppass@ds161159.mlab.com:61159/crud-blacqu-test', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
});
