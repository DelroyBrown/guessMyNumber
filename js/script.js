'use strict';

// Function to focus on the input box with the ID 'guessInput'.
let inputFocus = function () {
  document.getElementById('guessInput').focus();
};
inputFocus();

// overlay and play music
document.getElementById('startGame').addEventListener('click', function () {
  const overlay = document.querySelector('.start-game-overlay');
  overlay.style.opacity = '0';

  overlay.style.zIndex = '-2';
  overlay.style.backgroundColor = 'transparent';

  overlay.addEventListener('transitionend', function () {
    this.style.display = 'none';
  });

  trackController.playCurrentTrack(); // Start playing
});

// Track controller
const trackController = {
  tracks: ['track01', 'track02', 'track03', 'track04', 'track05'],
  currentTrackIndex: 0,
  isPlaying: false,
  get currentTrackName() {
    return this.tracks[this.currentTrackIndex];
  },
  get currentTrackElement() {
    return document.getElementById(`gameMusic${this.currentTrackIndex}`);
  },
  updateTrackDisplay() {
    document.getElementById(
      'currentTrack'
    ).textContent = `Current track: ${this.currentTrackName}`;
  },
  playCurrentTrack() {
    this.currentTrackElement.currentTime = 0;
    this.currentTrackElement.play();
    this.isPlaying = true;
    this.updateTrackDisplay();
    togglePlayPauseIcon(this.isPlaying);
  },

  pauseCurrentTrack() {
    this.currentTrackElement.pause();
    this.isPlaying = false;
    this.updateTrackDisplay();
    togglePlayPauseIcon(this.isPlaying);
  },

  nextTrack() {
    this.currentTrackElement.pause();
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    this.isPlaying = false; // Add this line
    this.playCurrentTrack();
  },

  prevTrack() {
    this.currentTrackElement.pause();
    this.currentTrackIndex =
      (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    this.isPlaying = false; // Add this line
    this.playCurrentTrack();
  },
};

document
  .getElementById('pausePlayMusic')
  .addEventListener('click', function () {
    if (trackController.isPlaying) {
      trackController.pauseCurrentTrack();
    } else {
      trackController.playCurrentTrack();
    }
  });

document.getElementById('nextTrack').addEventListener('click', function () {
  trackController.nextTrack();
});

document.getElementById('prevTrack').addEventListener('click', function () {
  trackController.prevTrack();
});

window.onload = function () {
  trackController.playCurrentTrack(); // Start playing
};

// Play/Pause music
function togglePlayPauseIcon(isPlaying) {
  if (isPlaying) {
    document.getElementById('playIcon').style.display = 'none';
    document.getElementById('pauseIcon').style.display = '';
  } else {
    document.getElementById('playIcon').style.display = '';
    document.getElementById('pauseIcon').style.display = 'none';
  }
}

// Initialize some variables.
let betweenNumber = 100; // Range of the guessing number
let secretNumber = Math.trunc(Math.random() * betweenNumber) + 1; // Randomly generated secret number.
let score = 20; // Initial score.
let highscore = 0; // Initial high score.

// Function to display message.
const displayMessage = function (message) {
  // Displays the passed message in the HTML element with the class 'message'.
  document.querySelector('.message').textContent = message;
};

// If the secretNumber is greater than 99, adjust the width of the element with class '.number'.
if (secretNumber > 99) {
  document.querySelector('.number').style.width = '18rem';
}

// Display the number range in the HTML element with the class '.between'.
document.querySelector(
  '.between'
).textContent = `(Between 1 & ${betweenNumber})`;

// Function to check the user's guess.
function checkGuess() {
  // Fetch the user's guess from the input box and convert it to a number.
  const guess = Number(document.querySelector('.guess').value);
  // Get the audio element for the button click sound.
  let buttonClickAudio = document.getElementById('buttonClickAudio');
  // Play the button click sound.
  buttonClickAudio.play();

  // When there is no input
  if (!guess) {
    // Display a message if the user did not input a number.
    displayMessage('No Number!! 🤬');

    // When the user guesses correctly.
  } else if (guess === secretNumber) {
    // If the guess is correct, display a success message.
    displayMessage('Correct Number!😎');
    // Change the background color to green.
    document.querySelector('body').style.backgroundColor = '#60b347';
    // Reveal the secret number.
    document.querySelector('.number').textContent = secretNumber;
    // Prompt the user to restart the game.
    document.querySelector('.page-title').textContent =
      'Click "Again!" to restart!';
    // Increase the width of the secret number box.
    document.querySelector('.number').style.width = '30rem';
    // Stop the button click sound.
    buttonClickAudio.pause();
    // Reset the time of the audio playback.
    buttonClickAudio.currentTime = 0;
    // Play the winning sound.
    const winAudio = document.getElementById('winningAudio');
    winAudio.play();

    // If the score is higher than the high score, update the high score.
    if (score > highscore) {
      highscore = score;
      document.querySelector('.highscore').textContent = highscore;
    }

    // When the guess is not correct
  } else if (guess !== secretNumber) {
    // If the score is more than 1, decrease the score.
    if (score > 1) {
      // If the guess is higher than the secret number, display "Too high!", otherwise display "Too low!".
      displayMessage(guess > secretNumber ? 'Too high!' : 'Too low!');
      // Decrease the score.
      score--;
      // Display the new score.
      document.querySelector('.score').textContent = score;
      // If the score is not more than 1, the user has lost the game.
    } else {
      // Display a losing message.
      displayMessage('You lost the game! 😢');
      // Set the score to 0.
      document.querySelector('.score').textContent = 0;
      // Prompt the user to restart the game.
      document.querySelector('.page-title').textContent =
        'Click "Again!" to restart!';
      // Change the background color to red to indicate a loss.
      document.querySelector('body').style.backgroundColor = 'red';
      // Stop the button click sound.
      buttonClickAudio.pause();
      // Reset the time of the audio playback.
      buttonClickAudio.currentTime = 0;
      // Play the losing sound.
      const looseAudio = document.getElementById('looseAudio');
      looseAudio.play();
    }
  }
}

// Add a click event listener to the element with the class '.check'.
document.querySelector('.check').addEventListener('click', function () {
  // When clicked, check the user's guess, refocus the input box and clear its value.
  checkGuess();
  inputFocus();
  document.querySelector('.guess').value = '';
});

// Add a keypress event listener to the guess input box.
document.querySelector('.guess').addEventListener('keypress', function (e) {
  // If the pressed key is 'Enter', check the user's guess and clear the input box.
  if (e.key === 'Enter') {
    checkGuess();
    document.querySelector('.guess').value = '';
  }
});

// Function to restart the game.
function restartGame() {
  // Reset score and secret number.
  score = 20;
  secretNumber = Math.trunc(Math.random() * 20) + 1;

  // Reset the UI.
  document.querySelector('.guess').value = '';
  document.querySelector('.score').textContent = score;
  document.querySelector('.number').textContent = '?';
  displayMessage('Start guessing...');
  document.querySelector('body').style.backgroundColor = '#222';
  document.querySelector('.number').style.width = '15rem';
  document.querySelector('.page-title').textContent = 'Guess My Number!';

  // Refocus the input box.
  inputFocus();
}

// Add a click event listener to the element with the class '.again'.
document.querySelector('.again').addEventListener('click', function () {
  // When clicked, restart the game.
  restartGame();
});
