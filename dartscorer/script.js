class Player {
    constructor(name, div, scoreDiv, outshotDiv, avgDiv, totalDartsDiv, dartsDiv, dartBoxDivs, currentTotalDiv) {
        this.name = name;
        this.trueScore = 501;
        this.score = 501;
        this.darts = [];
        this.currentDart = 0;
        this.currentDarts = ['','',''];
        this.currentTotal = 0;
        this.avg = "0.00";
        this.outshot = 0;

        this.div = document.getElementById(div);
        this.scoreDiv = document.getElementById(scoreDiv);
        this.outshotDiv = document.getElementById(outshotDiv);
        this.avgDiv = document.getElementById(avgDiv);
        this.totalDartsDiv = document.getElementById(totalDartsDiv);

        this.dartsDiv = document.getElementById(dartsDiv);
        this.dartBoxDivs = document.querySelectorAll(dartBoxDivs);
        this.currentTotalDiv = document.getElementById(currentTotalDiv);
    }

    subtractScore(x) {
        this.score -= x;
    }

    addToCurrentTotal(x) {
        this.currentTotal += x;
    }

    calcAvg() {
        if(this.darts.length > 0) {
            let total = 0
            for(let x in this.darts) {
                total += this.darts[x];
            }
            this.avg = (total / this.darts.length * 3).toFixed(2);
        } else {
            this.avg = 0.00;
        }
        
    }

    findOutshot() {

    }

    updatePlayerUI() {
        this.scoreDiv.innerHTML = this.score;
        if(this.outshot) {
            this.outshotDiv.innerHTML = this.outshot;
        }
        this.avgDiv.innerHTML = this.avg;
        this.totalDartsDiv.innerHTML = this.darts.length;
    
        this.dartBoxDivs[0].innerHTML = this.currentDarts[0];
        this.dartBoxDivs[1].innerHTML = this.currentDarts[1];
        this.dartBoxDivs[2].innerHTML = this.currentDarts[2];
        this.currentTotalDiv.innerHTML = "= " + this.currentTotal;
    }

    updateCurrentDartUI() {
        this.dartBoxDivs[0].classList.remove("dart-active");
        this.dartBoxDivs[1].classList.remove("dart-active");
        this.dartBoxDivs[2].classList.remove("dart-active");

        if(this.currentDart < 3) {
            this.dartBoxDivs[this.currentDart].classList.add("dart-active");
        }
    }
}

let player1;
let player2;
let players = [];

let ap; // Active player
let uap; // Unactive player


const doubleCheckbox = document.getElementById("checkbox-double");
const doubleText = document.querySelectorAll(".double-text");
let isDouble = 0;
const tripleCheckbox = document.getElementById("checkbox-triple");
const tripleText = document.querySelectorAll(".triple-text");
let isTriple = 0;

// Modals
const settingsModal = document.getElementById("settings-modal");
const helpModal = document.getElementById("help-modal");

function switchActivePlayer () {
    ap = 1 - ap;
    uap = 1 - uap;
    players[ap].currentDart = 0;
    players[ap].currentDarts = ['','',''];
    players[ap].currentTotal = 0;
    showActivePlayer();
    players[ap].updateCurrentDartUI();
    players[ap].updatePlayerUI();
}

function showActivePlayer() {
    players[ap].div.classList.remove("unactive-player");
    players[ap].div.classList.add("active-player");
    players[uap].div.classList.remove("active-player");
    players[uap].div.classList.add("unactive-player");

    players[ap].dartsDiv.classList.remove("unactive-player-darts");
    players[uap].dartsDiv.classList.add("unactive-player-darts");
}

function addDart(dart) {
    let dartValue = dart;
    let dartText = dart.toString();
    let player = players[ap];

    if(isDouble && dart < 21 && dart != 0) {
        dartValue = 2 * dart;
        dartText = "D" + dartText;
    } else if(isTriple && dart < 21 && dart != 0){
        dartValue = 3 * dart;
        dartText = "T" + dartText;
    }

    player.currentDarts[player.currentDart] = dartText;

    if((player.score - dartValue < 0) || (player.score - dartValue == 0 && !isDouble)) {
        let i = player.currentDart;
        player.currentDart = 3;
        player.currentTotal = 'BUST';
        player.score = player.trueScore;
        
        while(i>0){
            player.darts.pop();
            i--;
        }
        player.darts.push(0,0,0);
    } else if(player.score - dartValue >= 0) {
        player.currentDart += 1;
        player.currentTotal += dartValue;
        player.subtractScore(dartValue);
        player.darts.push(dartValue);
    }

    player.calcAvg();
    player.updatePlayerUI();
    player.updateCurrentDartUI();

    if (player.score == 0 && isDouble) {
        doubleCheckbox.checked = false;
        toggleDouble();
        alert("Game over!");
        newGame();
    } else {
        if(isDouble) {
            doubleCheckbox.checked = false;
            toggleDouble();
        } else if(isTriple) {
            tripleCheckbox.checked = false;
            toggleTriple();
        }
        
        if(player.currentDart == 3) {
            player.trueScore = player.score;
            switchActivePlayer();
        }
    }
}

function toggleDouble() {
    isDouble = 1 - isDouble;

    if (isDouble){
        for(let i = 0; i < doubleText.length; i++) {
            doubleText[i].style.display = "inline";
        }
        if (isTriple) {
            tripleCheckbox.checked = false;
            toggleTriple();
        }
    } else {
        for(let i = 0; i < doubleText.length; i++) {
            doubleText[i].style.display = "none";
        }
    }
}

function toggleTriple() {
    isTriple = 1 - isTriple;

    if (isTriple){
        for(let i = 0; i < tripleText.length; i++) {
            tripleText[i].style.display = "inline";
        }
        if (isDouble) {
            doubleCheckbox.checked = false;
            toggleDouble();
        }
    } else {
        for(let i = 0; i < doubleText.length; i++) {
            tripleText[i].style.display = "none";
        }
    }
}

function undo() {
    if(player1.darts.length > 0) {
        let player = players[ap];
        if(player.currentDart > 0) {
            player.currentTotal -= player.darts.pop();
            player.score = player.trueScore - player.currentTotal;
            player.currentDart -= 1;
            player.currentDarts[player.currentDart] = '';
            player.calcAvg();
            player.updatePlayerUI();
            player.updateCurrentDartUI();
        } else {
            player.currentDart = 3;
            player.updatePlayerUI();
            player.updateCurrentDartUI();
            ap = 1 - ap;
            uap = 1 - uap;
            let lastDarts = players[ap].darts.slice(-3);
            players[ap].trueScore += lastDarts[2] + lastDarts[1] + lastDarts[0];
            players[ap].calcAvg();
            showActivePlayer();
            undo();
        }
    }
}

function openSettings() {
    settingsModal.style.display = "flex";
}

function openHelp() {
    helpModal.style.display = "flex";
}

function closeSettings() {
    settingsModal.style.display = "none";
}

function closeHelp() {
    helpModal.style.display = "none";
}

function newGame() {

    player1 = new Player("Player 1", "player1", "p1-score", "p1-outshot", "p1-stat-avg", "p1-stat-darts", "p1-darts", ".p1-dart-box", "p1-dart-total");
    player2 = new Player("Player 2", "player2", "p2-score", "p2-outshot", "p2-stat-avg", "p2-stat-darts", "p2-darts", ".p2-dart-box", "p2-dart-total");
    players = [player1, player2]

    ap = 0; // Active player (player 1)
    uap = 1; // Unactive player (player 2)

    showActivePlayer();
    player1.updateCurrentDartUI();
    player2.currentDart = 3;
    player2.updateCurrentDartUI();
    player1.updatePlayerUI();
    player2.updatePlayerUI();
}

newGame();