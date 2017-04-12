var view = {
    displayMessage: function(msg) {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    displayHit: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },
    displayMiss: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};
var model = {
    boardSize: 7,
    numShip: 3,
    shipLength: 3,
    shipSunk: 0,
    ships: [{ locations: ["0", "0", "0"], hits: ["", "", ""] },
        { locations: ["0", "0", "0"], hits: ["", "", ""] },
        { locations: ["0", "0", "0"], hits: ["", "", ""] }
    ],
    fire: function(guess) {
        for (var i = 0; i < this.numShip; i++) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);
            if (index >= 0) {
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("TRAFIONY!!!");
                if (this.isSunk(ship)) {
                    view.displayMessage("Zatopiłęs mój okręt!");
                    this.shipSunk++;
                }
                return true;
            }
        }

        view.displayMiss(guess);
        view.displayMessage("Spudłowałeś.");
        return false;
    },
    isSunk: function(ship) {
        for (var i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
    },
    generateShipLocations: function() {
        var locations;
        for (var i = 0; i < this.numShip; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(location))
            this.ships[i].locations = locations;
        }
    },
    generateShip: function() {
        var direction = Math.floor(Math.random() * 2);
        var row, col;


        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        } else {
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            col = Math.floor(Math.random() * this.boardSize)
        };
        var newShipLocations = [];
        for (var i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i));
            } else {
                newShipLocations.push((row + i) + "" + col);
            }
        }
        return newShipLocations;
    },
    collision: function(locations) {
        for (var i = 0; i < this.numShip; i++) {
            var ship = model.ships[i];
            for (var j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }


};
var controller = {
    guesses: 0,
    processGuess: function(guess) {
        var location = this.parseGuess(guess);
        if (location) {
            this.guesses++;
            var hit = model.fire(location);
            if (hit) {
                if (model.shipSunk === model.numShip) {
                    view.displayMessage("Zatopiłes wszystkie okręty, w " + this.guesses + " próbach.");
                }
            }
        }

    },
    parseGuess: function(guess) {
        var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
        if (guess.length !== 2 || guess === null) {
            alert("Proszę wpisac, literę i cyfrę");
        } else {

            firstChar = guess.charAt(0);
            firstChar = firstChar.toUpperCase();
            var row = alphabet.indexOf(firstChar);
            var column = guess.charAt(1);
            if (isNaN(row) || isNaN(column)) {
                alert("To nie są współrzędne");
            } else if (row < 0 || row >= model.boardSize || column < 0 || column > model.boardSize - 1) {
                alert("Pole poza plansza");
            } else {
                return row + column;
            }
        }
        return null;
    }

};

function init() {
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handlerFireButton;
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;
    model.generateShipLocations();
}

function handlerFireButton() {
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value = "";

}

function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

window.onload = init;