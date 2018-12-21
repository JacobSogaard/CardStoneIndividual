document.getElementById("createBTN").addEventListener('click', create);
document.getElementById("joinBTN").addEventListener('click', join);

function getXhr(targetUrl) {
    return xhr;
}

function create() {
    console.log("Create");
    const playerId = document.getElementById("playerId").value;
    const gameId = document.getElementById("gameId").value;
    console.log(playerId);
    console.log(gameId);
    sessionStorage.setItem("gameId", gameId);
    sessionStorage.setItem("playerId", playerId);
            
    const targetUrl = 'createGame/' + gameId + "/" + playerId;
    const url = 'http://localhost:8080/' + targetUrl;
    const xhr = new XMLHttpRequest();
    xhr.response = 'html';
    xhr.open("GET", url);
    xhr.responseType = 'document';
    xhr.send();

    xhr.onreadystatechange = processreq;



    //Act on the data received from the request
    function processreq(e) { 
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById("startBTN").disabled = false;
        }

        if (xhr.status == 400) {
            document.getElementById("gameNameTaken").innerHTML = "Game name already taken";
        }
    }
}

function join() {
    const playerId = document.getElementById("playerId");
    const gameId = document.getElementById("gameId");
    const targetUrl = 'joinGame/' + gameId.value + "/" + playerId.value;
    const url = 'http://localhost:8080/' + targetUrl;
    const xhr = new XMLHttpRequest();
    xhr.response = 'html';
    xhr.open("GET", url);
    xhr.send();
    
    xhr.onreadystatechange = processreq;

    function processreq(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            sessionStorage.setItem("gameId", gameId.value);
            sessionStorage.setItem("playerId", playerId.value);
            document.getElementById("startBTN").disabled = false;
        }
    }

}


function drawCard(playerId) {
    //Send the request
    const url = 'http://localhost:8080/drawCard/1/' + playerId;
    const Http = new XMLHttpRequest();
    Http.responseType = 'json';
    Http.open("GET", url);		
    Http.send();
    document.getElementById("player" + playerId + "DrawCard").disabled = true;

    if (playerId == '1') {
        document.getElementById("player" + 2 + "DrawCard").disabled = false;
    } else {
        document.getElementById("player" + 1 + "DrawCard").disabled = false;
    }

    Http.onreadystatechange = processreq;



    //Act on the data received from the request
    function processreq(e) { 
        if (Http.readyState == 4 && Http.status == 200) {
            const data =  Http.response;
            console.log("Data from GET request at: " + url + ":\n" + JSON.stringify(data));
            document.getElementById("devTestCard").innerHTML = data.name;
        }
    }

}