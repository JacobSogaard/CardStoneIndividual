//Set eventlistener for all card slots (hand, player board and opponent board)
document.body.addEventListener('click', event => {
    if (event.target.nodeName == 'DIV'){
        const clicked = event.target.id.slice(0, -1);
        switch(clicked) {
            case 'oboard':
                target(event.target);
                break;
            case 'pboard':
                playCard(event.target);
                break;
            case 'phand':
                selectcard(event.target);
                break;
        }
    }
});

//Eventlisteners for all buttons
document.getElementById('lookForUpdatesBTN').addEventListener('click', lookForUpdates);
document.getElementById('drawCardBTN').addEventListener('click', drawCard);
document.getElementById('endTurnBTN').addEventListener('click', endTurn);


var selectedCardHand = "0"; //Handles the card that is currently selected.
	var emptyHandPos = "0";
	var playerHand = [];
	var selectedCardBoard = "0";

	function setButtons(){
		console.log("Start of game");
		const gameId = sessionStorage.getItem("gameId");
		const url = `http://localhost:8080/getGame/${gameId}`;
		const xhr = new XMLHttpRequest();
		xhr.open("GET", url);
		xhr.send();

		//Check that we actually get a valid response
		xhr.onload = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				const data =  JSON.parse(xhr.response);
				if (data.player2.name !== ''){
					document.getElementById("endTurnBTN").disabled = true;
					document.getElementById("drawCardBTN").disabled = true;
				}
			}
		}

	}

	function selectcard(card){
		selectedCardHand = card;
	}

	function playCard(pos){
		console.log(pos.className);
		if (selectedCardHand.className != "card" || pos.className != "cardslot") {
			if (pos.className == "card") {
				document.getElementById(pos.id).className = "selectedcard";
				selectedCardBoard = pos;
			}
			return;
		}

		const gameId = sessionStorage.getItem("gameId");
		const playerId = sessionStorage.getItem("playerId");
		const boardId = pos.id.substring(6); //Doesn't work.. Could just get substring to strip away the pboard part of id
		
		//Problem getting card id from the div that the card is written in... Maybe JQuery?

		const id = selectedCardHand.id.substring(5,6);
		const cardId = this.playerHand[Number(id)].id;
		this.playerHand.splice(Number(id), 1);
		emptyHandPos--;

		const url = `http://localhost:8080/playCard/${gameId}/${playerId}/${cardId}/${boardId}`;
		const xhr = new XMLHttpRequest();
		xhr.open("GET", url);
		xhr.send();

		//Check that we actually get a valid response
		xhr.onload = function() {
			var update = JSON.parse(xhr.response);
			document.getElementById(pos.id).className = "card";
			document.getElementById(selectedCardHand.id).innerHTML = "";
			updateBoard(update);

		}		
	}

	function endTurn(){
		const gameId = sessionStorage.getItem("gameId");
		const url = `http://localhost:8080/endTurn/${gameId}`;
		const xhr = new XMLHttpRequest();
		xhr.open("PUT", url);
		xhr.send();
		document.getElementById("endTurnBTN").disabled = true;
		document.getElementById("drawCardBTN").disabled = true;
	}

	function drawCard() {
			const gameId = sessionStorage.getItem("gameId");
			const playerId = sessionStorage.getItem("playerId");
			//document.getElementById("drawCardBTN").disabled = true;  //Remove comment when update button works to avoid multiple carddraw!
			const url = `http://localhost:8080/drawCard/${gameId}/${playerId}`;
			const xhr = new XMLHttpRequest();
			xhr.open("GET", url);
			xhr.send();

			xhr.onreadystatechange = processreq;
			function processreq(e) {
				if (xhr.readyState == 4 && xhr.status == 200) {
					const data = JSON.parse(xhr.response);
					console.log("card id: " + data.id);
					if (data.id != "-1") {
						playerHand[emptyHandPos] = data;
						var id = "phand" + emptyHandPos;
						emptyHandPos++;
						const cardText = data.name + '\nCost:' + data.cost + '\nAttack:' + data.attack + '\nHealth:' + data.health;
						document.getElementById(id).innerHTML = cardText;
						//document.getElementById(id).alt = "card";
						document.getElementById(id).className = "card";
					}
				}
			}
		}
			
		
	function lookForUpdates() {
		var gameId = sessionStorage.getItem("gameId");
		var playerId = sessionStorage.getItem("playerId");
		const url = `http://localhost:8080/lookForUpdates/${gameId}/${playerId}`;
		const xhr = new XMLHttpRequest();
		xhr.open("GET", url);
		xhr.send();
		
		xhr.onreadystatechange = processreq;
		//Act on the data received from the request
		function processreq(e) { 
			if (xhr.readyState == 4 && xhr.status == 200) {
				const data =  JSON.parse(xhr.response);
				
				if (data.updated) {
					var pboard;
					var opboard;
					if (data.player1.name == sessionStorage.getItem("playerId")){ 
						opboard = data.player2.board;
						pboard = data.player1;
					} else {
						opboard = data.player1.board;
						pboard = data.player2;
					}
					updateBoard(pboard);
					updateOpponentBoard(opboard);
					
					//var board = data.board;
					
					
					document.getElementById("endTurnBTN").disabled = false;
					document.getElementById("drawCardBTN").disabled = false;
			}
			}
		}
		//document.getElementById("opponentCard").innerHTML = "Your opponent has drawn: " +  "nothing yet because this function needs implementation ";
			
	}

	function updateOpponentBoard(board){
		for (var i = 0; i < 6; i++) {
			document.getElementById("oboard" + i).innerHTML = "";
			document.getElementById("oboard" + i).className = "cardslot";
		}
		
		count = 0;
		for (var card in board) {
			if (board[card] != 0) {
				document.getElementById("oboard" + count).innerHTML = board[card].name + '\nCost: ' + board[card].cost 
					+ "\nAttack: " + board[card].attack + "\nHealth: " + board[card].health;
				document.getElementById("oboard" + count).className = "card";
			}
		count++;
		}
	}

	//Function to update player board using xhr response after it has been json parsed
	function updateBoard(data){
		var hand = data.hand;
		var board = data.board;
		
		var count = 0;
		for (var card in hand) {
				document.getElementById("phand" + count).innerHTML = hand[card].name + '\nCost: ' + hand[card].cost 
					+ "\nAttack: " + hand[card].attack + "\nHealth: " + hand[card].health;
			count++;

		}

		document.getElementById("phand" + count).innerHTML = "";
		document.getElementById("phand" + count).className = "emptyCard";
		
		for (var i = 0; i < 6; i++) {
			document.getElementById("pboard" + i).innerHTML = "";
			document.getElementById("pboard" + i).className = "cardslot";
		}

		count = 0;
		for (var bcard in board) {
			if (board[bcard] != 0) {
				document.getElementById("pboard" + count).innerHTML = board[bcard].name + '\nCost: ' + board[bcard].cost 
					+ "\nAttack: " + board[bcard].attack + "\nHealth: " + board[bcard].health;
				document.getElementById("pboard" + count).className = "card";
			}
			count++;
		}

	}

	function target(pos) {
		if (pos.className == "card" && selectedCardBoard != "0") {
	
			const gameId = sessionStorage.getItem("gameId");
			const playerId = sessionStorage.getItem("playerId");
			const targetingCardIndex = selectedCardBoard.id.substring(6,7);
			const targetedCardIndex = pos.id.substring(6,7);
	
			const url = `http://localhost:8080/targetCard/${gameId}/${playerId}/${targetingCardIndex}/${targetedCardIndex}`;
			const xhr = new XMLHttpRequest();
			xhr.open("GET", url);
			xhr.send();

			//Set some check on response code
			xhr.onload = function() {
				if (xhr.readyState == 4 && xhr.status == 200) {
					const data =  JSON.parse(xhr.response);
					if (playerId == data.player1.name) {
						updateBoard(data.player1);
						updateOpponentBoard(data.player2.board);
					} else {
						updateBoard(data.player2);
						updateOpponentBoard(data.player1.board);
					}

					
				}
				
				
			}
			document.getElementById(selectedCardBoard.id).className = "card";
			selectedCardBoard = "0";
			
			
		}
		
	}
