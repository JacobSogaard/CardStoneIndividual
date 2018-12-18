exports.player1 = {
	name: "",
	deck: [],
	hand: [],
	board: [0,0,0,0,0,0],
	currentMana: 0,
	totalMana: 1
};

exports.player2 = {
	name: "",
	deck: [],
	hand: [],
	board: [0,0,0,0,0,0],
	currentMana: 0,
	totalMana: 1
};

exports.currentPlayer = 'p1'; //Might want to reconsider this to just use the actual player
var hasUpdated = false;

exports.getGame = function() {
	const game = {player1: this.player1, player2: this.player2, updated: hasUpdated};
	this.hasUpdated = false;
	return game;

};

exports.endTurn = function() {
	if (this.currentPlayer == 'p1') {
		this.currentPlayer = 'p2';
		this.player2.totalMana++;
		this.player2.currentMana = this.player2.totalMana;
	} else {
		this.currentPlayer = 'p1'; 
		this.player1.totalMana++;
		this.player1.currentMana = this.player1.totalMana;
	}
	hasUpdated = true;
	console.log("Current player end turn: " + this.currentPlayer);
};

exports.getCurrentPlayerName = function(){
	if (this.currentPlayer == 'p1'){
		return this.player1.name;
	} else {
		return this.player2.name;
	}
}


exports.create = function(playerName) {
	console.log("Create call: " + playerName);
	//this.player1 = require('./Player');
	//this.player1.setName(playerName);
	this.player1.name = playerName;
	this.setDeck('player1', 0);
};

exports.join = function(playerName) {
	console.log("Join call: " + playerName);
	//this.player2 = require('./Player');
	//this.player2.setName(playerName);
	this.player2.name = playerName;
	this.setDeck('player2', 0);
};


exports.attack = function(playerName, attIndex, defIndex) {
	if ((playerName == this.player1.name && this.currentPlayer != 'p1') ||
		(playerName == this.player2.name && this.currentPlayer != 'p2') ) {
		return this.getGame();
	}

	if (this.currentPlayer == 'p1') {
		attackLogic(this.player1, this.player2, attIndex, defIndex);
	}
	if (this.currentPlayer == 'p2') {
		attackLogic(this.player2, this.player1, attIndex, defIndex);
	}

	return this.getGame();
};

attackLogic = function(attack, defend, attIndex, defIndex) {
	var attacker = attack.board[attIndex];
	var defender = defend.board[defIndex];

	var attHealth = attacker.health = attacker.health - defender.attack;
	var defHealth = defender.health = defender.health - attacker.attack;

	if (attHealth < 1) {
		attack.board.splice(attIndex, 1); // Remove if dead
	} else {
		attack.board[attIndex] = attacker;
	}

	if (defHealth < 1 ) {
		defend.board.splice(defIndex, 1);
	} else {
		defend.board[defIndex] = defender;
	}
}

exports.playCard = function(playerName, cardToPlayId, boardIndex) {
	if (playerName == this.player1.name && this.currentPlayer == 'p1') {
		for (var card in this.player1.hand) {
			if (this.player1.hand[card].id == cardToPlayId) {
				//break out if card is too expensive to  play
				if (this.player1.hand[card].cost > this.player1.currentMana) {
					//break;
				}
				var cardPlayed = this.player1.hand[card];
				this.player1.hand.splice(card, 1);
				this.player1.board[boardIndex] = cardPlayed;
				//console.log("boardIndex: " + boardIndex);
				//console.log(this.player1.board);
				this.player1.currentMana = this.player1.currentMana - cardPlayed.cost;
				return this.player1;
			}
		}

	} else if (playerName == this.player2.name && this.currentPlayer == 'p2') {
		for (var card in this.player2.hand) {
			if (this.player2.hand[card].id == cardToPlayId) {
				//break out if card is too expensive to  play
				if (this.player2.hand[card].cost > this.player2.currentMana) {
					//break;
				}

				var cardPlayed = this.player2.hand[card];
				this.player2.hand.splice(card, 1);
				this.player2.board[boardIndex] = cardPlayed;
				this.player2.currentMana = this.player2.currentMana - cardPlayed.cost;
				return this.player2;
			}
		}
	}

	
};

exports.drawCard = function(playerName) {
	var cardDrawn = {id : "-1"}; //dummy card if deck is empty or hand is too full

	if (playerName == this.player1.name && this.currentPlayer == 'p1' && this.player1.deck.length > 0 && this.player1.hand.length < 6) {
		cardDrawn = this.player1.deck.pop();
		this.player1.hand.push(cardDrawn);

	} else if (playerName == this.player2.name && this.currentPlayer == 'p2' && this.player2.deck.length > 0 && this.player2.hand.length < 6) {
		cardDrawn = this.player2.deck.pop();
		this.player2.hand.push(cardDrawn);
	}

	return cardDrawn;
};

exports.setDeck = function(thePlayer, idAdder) {
	var fs = require('fs');
	var deck = require('./Deck');
	var playerDeck = deck.getDeck('deck1');

	for (var i = 0; i < playerDeck.deckList.length; i++) {

		var tempCardString = './cards/' + playerDeck.deckList[i] + '.json'; //filePath
		var tempCardRaw = fs.readFileSync(tempCardString); //some raw data 
		var tempCard = JSON.parse(tempCardRaw); //card as json
		tempCard.id = String(i + idAdder);

		if (thePlayer == 'player1') {
			this.player1.deck.push(tempCard);
		} else if (thePlayer == 'player2') {
			this.player2.deck.push(tempCard);
		}
	}
};


