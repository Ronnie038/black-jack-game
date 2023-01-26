// / blackjack Game

let blackjackGame = {
	you: {
		scoreSpan: '#your-blackjack-result',
		div: '#your-box',
		score: 0,
	},
	dealer: {
		scoreSpan: '#dealer-blackjack-result',
		div: '#dealer-box',
		score: 0,
	},
	cards: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A', 'K', 'Q', 'J'],
	cardsMap: {
		2: 2,
		3: 3,
		4: 4,
		5: 5,
		6: 6,
		7: 7,
		8: 8,
		9: 9,
		10: 10,
		A: [1, 11],
		K: 10,
		Q: 10,
		J: 10,
	},
	wins: 0,
	losses: 0,
	draws: 0,
	isStand: false,
	turnsOver: false,
};

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];
const CARDS = blackjackGame['cards'];
const CARDSMAP = blackjackGame['cardsMap'];
const hitSound = new Audio('sounds/swish.m4a');
const winSound = new Audio('sounds/cash.mp3');
const lossSound = new Audio('sounds/aww.mp3');

// * balck jack buttons
document
	.querySelector('#blackjack-hit-button')
	.addEventListener('click', blackjackHit);

document
	.querySelector('#blackjack-deal-button')
	.addEventListener('click', blackjackDeal);

document
	.querySelector('#blackjack-stand-button')
	.addEventListener('click', dealerLogic);

//| black hit funtion

function blackjackHit() {
	if (blackjackGame['isStand'] === false) {
		let card = randomCards();
		showCard(YOU, card);
		updateScore(YOU, card);
		console.log(YOU, card);
		showScore(YOU);
	}
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// ! Dealer logic

async function dealerLogic() {
	blackjackGame['isStand'] = true;
	while (DEALER['score'] < 16 && blackjackGame['isStand'] === true) {
		let card = randomCards();
		showCard(DEALER, card);
		updateScore(DEALER, card);
		showScore(DEALER);
		await sleep(1000);
	}

	blackjackGame['turnsOver'] = true;
	let winner = computeWinner();
	showResult(winner);
}
// //////|||||||||||||||||||
function randomCards() {
	let randomIndex = Math.floor(Math.random() * 13);

	return CARDS[randomIndex];
}

// * blackjack game card Show

function showCard(activePlayer, card) {
	if (activePlayer['score'] <= 21) {
		let cardImage = document.createElement('img');
		cardImage.src = `/images/${card}.png`;

		document.querySelector(activePlayer['div']).appendChild(cardImage);
		hitSound.play();
	} else {
	}
}

// * blackjack deal

function blackjackDeal() {
	// showResult(computeWinner());
	if (blackjackGame['turnsOver'] === true) {
		blackjackGame['isStand'] = false;

		let yourImages = document
			.querySelector('#your-box')
			.querySelectorAll('img');
		let dealerImages = document
			.querySelector('#dealer-box')
			.querySelectorAll('img');

		for (let i = 0; i < yourImages.length; i++) {
			yourImages[i].remove();
		}
		for (let i = 0; i < dealerImages.length; i++) {
			dealerImages[i].remove();
		}

		YOU['score'] = 0;
		DEALER['score'] = 0;
		document.querySelector('#your-blackjack-result').textContent = 0;
		document.querySelector('#dealer-blackjack-result').textContent = 0;

		document.querySelector('#your-blackjack-result').style.color = '#ffffff';
		document.querySelector('#dealer-blackjack-result').style.color = '#ffffff';

		document.querySelector('#blackjack-result').textContent = `Let's play`;
		document.querySelector('#blackjack-result').style.color = `black`;

		blackjackGame['turnsOver'] = true;
	}

	// console.log(YOU['score']);
}

// ! update score
function updateScore(activePlayer, card) {
	if (card === 'A') {
		if (activePlayer['score'] + CARDSMAP[card][1] <= 21) {
			activePlayer['score'] += CARDSMAP[card][1];
		} else {
			activePlayer['score'] += CARDSMAP[card][0];
		}
	} else {
		activePlayer['score'] += CARDSMAP[card];
	}
}

function showScore(activePlayer) {
	if (activePlayer['score'] > 21) {
		document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
		document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
	} else {
		document.querySelector(activePlayer['scoreSpan']).textContent =
			activePlayer['score'];
	}
}

function computeWinner() {
	let winner;

	if (YOU['score'] <= 21) {
		if (YOU['score'] > DEALER['score'] || DEALER['score'] > 21) {
			blackjackGame['wins']++;
			winner = YOU;
		} else if (YOU['score'] < DEALER['score']) {
			blackjackGame['losses']++;
			winner = DEALER;
		} else if (YOU['score'] === DEALER['score']) {
			blackjackGame['draws']++;
		}

		//* condition when user busts but dealer dosen't
	} else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
		blackjackGame['losses']++;

		winner = DEALER;

		// * condition when you and Dealer both are busts
	} else if (YOU['score'] > 21 && DEALER['score'] > 21) {
		blackjackGame['draws']++;
	}

	console.log('Winner is', winner);

	return winner;
}

function showResult(winner) {
	let message, messageColor;

	if (blackjackGame['turnsOver'] === true) {
		if (winner === YOU) {
			document.querySelector('#wins').textContent = blackjackGame['wins'];
			message = 'You won!';
			messageColor = 'green';
			winSound.play();
		} else if (winner === DEALER) {
			document.querySelector('#losses').textContent = blackjackGame['losses'];
			message = 'You lost!';
			messageColor = 'red';
			lossSound.play();
		} else {
			document.querySelector('#draws').textContent = blackjackGame['draws'];
			message = 'You drew!';
			messageColor = 'black';
		}
		document.querySelector('#blackjack-result').textContent = message;
		document.querySelector('#blackjack-result').style.color = messageColor;
		document;
	}
}
