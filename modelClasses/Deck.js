//Dummy function for testen drawing different cards based on different criterias
//Real implementation is needed.
exports.drawCard = function(cardToDraw) {
	theCard = require('../cards/card' + cardToDraw + '.json');
	return theCard;
};


exports.getDeck = function(theDeck) {
	var fs  = require('fs');
	var path = './decks/' + theDeck + '.json';
	var deckRaw = fs.readFileSync(path);
	var deck = JSON.parse(deckRaw);

	return deck; 
};
