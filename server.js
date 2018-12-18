// Load the express module to create a server
var express = require('express');
var app = express(); 
app.set('view engine', 'ejs');  
var path = require('path');
var games = {};
var fs = require('fs');

//-----List all the implementing api methods------

//API for starting the front page. Should also asign player id.
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname+'/Frontpage.html'));
});


app.get('/InProgressGame', function(request, response) {

  response.sendFile(path.join(__dirname+'/InProgressGame.html'));
});

app.get('/joinGame/:gameId/:playerId', function(request, response) {
  if (typeof games[request.params.gameId] !== 'undefined') { 
    var game = games[request.params.gameId];
    game.join(request.params.playerId);
    response.sendFile(path.join(__dirname+'/InProgressGame.html'));
  }

  

});

app.get('/createGame/:gameId/:playerId', function(request, response) {
  console.log("CREATE GAME");
  var game = require('./modelClasses/Game');

  var playerName = request.params.playerId;
  if (games[request.params.gameId] == undefined){
    game.create(playerName);
    games[request.params.gameId] = game;
    response.sendFile(path.join(__dirname+'/InProgressGame.html'));
  } else {
    response.status(400);
    response.send('Game name already taken');
  }

});


//API for drawing a card based on the game and the player (GameId has not yet been implemented)
app.get('/drawCard/:gameId/:playerId', function(request, response) {
  var game = games[request.params.gameId];
  var cardDrawn = game.drawCard(request.params.playerId);

  response.setHeader("Access-Control-Allow-Origin", "*"); //How much access should be given?
  response.set("Content-Type", "text/json"); 
  response.end(JSON.stringify(cardDrawn));

  console.log(cardDrawn.name + " has been drawn");
});

app.get('/playCard/:gameId/:playerId/:cardId/:placeOnBoard', function(request, response) {

  var gameUpdate = games[request.params.gameId].playCard(request.params.playerId, 
    request.params.cardId, request.params.placeOnBoard);

  response.setHeader("Access-Control-Allow-Origin", "*");
  response.set("Content-Type", "text/json"); 
  response.end(JSON.stringify(gameUpdate));

});

app.get('/targetCard/:gameId/:playerId/:targetingCardIndex/:targetedCardIndex', function(request, response)  {
  var theGame = request.params.gameId;
  var thePlayer = request.params.playerId;

  var targetingCard = Number(request.params.targetingCardIndex);
  var targetedCard = Number(request.params.targetedCardIndex);
  var updatedPlayers = games[theGame].attack(thePlayer, targetingCard, targetedCard);
  console.log("Updated players: " + updatedPlayers);
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.set("Content-Type", "text/json");
  response.end(JSON.stringify(updatedPlayers));
});

app.put('/endTurn/:gameId', function(request, response) {
  console.log("End turn server");
  games[request.params.gameId].endTurn();
});

var server = app.listen(8080, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log("CardStone server listening at http://%s:%s", host, port);
});


app.get('/getGame/:gameId', function(request, response) {
  var gameState = games[request.params.gameId].getGame();
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.set("Content-Type", "text/json"); 
  response.end(JSON.stringify(gameState));
});

app.get('/lookForUpdates/:gameId/:playerId', function(request, response){
  var gameState = games[request.params.gameId];

  if (gameState.getCurrentPlayerName() == request.params.playerId) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.set("Content-Type", "text/json"); 
    response.end(JSON.stringify(gameState.getGame()));
  } else {
    response.status(400);
    response.send("Not current player");
  }

  


});


app.use('/Images', express.static(__dirname + '/Images'));