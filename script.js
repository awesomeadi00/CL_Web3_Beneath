const doorLinks = document.querySelectorAll('.door-link');
const backToMainMenuButtons = document.querySelectorAll('.back-to-main');
let audioContext = null;
let hoverSoundBuffer = null;
let audioInstance = null;

const delayDuration = 400; // for adjusting delay duration

//  to preload the audio file
function preloadAudio(url) {
  const request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  request.onload = function() {
    audioContext.decodeAudioData(request.response, function(buffer) {
      hoverSoundBuffer = buffer;
    });
  };

  request.send();
}

//  to play the hover sound
function playHoverSound() {
  if (hoverSoundBuffer) {
    const source = audioContext.createBufferSource();
    source.buffer = hoverSoundBuffer;
    source.connect(audioContext.destination);
    source.start(0);
  }
}

// initialize the audio context and preload the hover sound
window.addEventListener('DOMContentLoaded', () => {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  preloadAudio('audio/effect.mp3'); // update the file path if necessary
});

doorLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault(); // prevent the default link behavior

    const doorNumber = link.dataset.door;
    localStorage.setItem(`door${doorNumber}Colored`, 'true');
    link.classList.add('colored');

    //  the hover sound
    playHoverSound();

    //  a class to trigger the transition animation
    document.body.classList.add('page-transition');

    // go to the door page after the transition animation ends
    setTimeout(() => {
      window.location.href = link.href;
    }, delayDuration); // addjust the duration to match the transition animation duration
  });
});

backToMainMenuButtons.forEach(button => {
  button.addEventListener('click', (event) => {
    event.preventDefault(); // prevent default anchor link behavior
    history.back(); // go back in the browser history
  });
});

window.addEventListener('DOMContentLoaded', () => {
  // check if the page was refreshed
  if (performance.navigation.type === 1) {
    // clear the stored door colors from localStorage
    for (let i = 1; i <= doorLinks.length; i++) {
      localStorage.removeItem(`door${i}Colored`);
    }
  } else {
    // apply the colored state to doors based on localStorage
    doorLinks.forEach((link) => {
      const doorNumber = link.dataset.door;
      const coloredState = localStorage.getItem(`door${doorNumber}Colored`);
      if (coloredState === 'true') {
        link.classList.add('colored');
      }
    });
  }
});

window.addEventListener('beforeunload', () => {
  // store the colored state of each door in local storage before navigating away
  doorLinks.forEach((link) => {
    const doorNumber = link.dataset.door;
    const isColored = link.classList.contains('colored');
    localStorage.setItem(`door${doorNumber}Colored`, isColored.toString());
  });
});

// array of phobias and their descriptions
const phobias = [
  {
    name: "Arachnophobia",
    description: "Fear of spiders"
  },
  {
    name: "Acrophobia",
    description: "Fear of heights"
  },
  {
    name: "Claustrophobia",
    description: "Fear of confined spaces"
  },
  {
    name: "Agoraphobia",
    description: "Fear of open or crowded spaces"
  },
  {
    name: "Cynophobia",
    description: "Fear of dogs"
  },
  {
    name: "Ophidiophobia",
    description: "Fear of snakes"
  },
  {
    name: "Nyctophobia",
    description: "Fear of the dark"
  },
  {
    name: "Trypanophobia",
    description: "Fear of needles or injections"
  },
  {
    name: "Aerophobia",
    description: "Fear of flying"
  },
  {
    name: "Mysophobia",
    description: "Fear of germs or contamination"
  }
];

window.addEventListener('DOMContentLoaded', () => {
  const phobiaContainer = document.getElementById('phobia-container');

  // display the question mark on page load
  phobiaContainer.innerHTML = '<h3>?</h3>';

  function displayPhobia() {
    console.log('displayPhobia function called');
    phobiaContainer.innerHTML = '';

    const randomPhobia = phobias[Math.floor(Math.random() * phobias.length)]; // get a random phobia from the array
    const phobiaElement = document.createElement('div');
    phobiaElement.innerHTML = `
      <h3>${randomPhobia.name}</h3>
      <p>${randomPhobia.description}</p>
    `;
    phobiaContainer.appendChild(phobiaElement);
  }

  let isFirstClick = true;

  phobiaContainer.addEventListener('click', function() { // event listener for the phobia container
    console.log('Phobia container clicked');
    
    if (isFirstClick) {
      phobiaContainer.innerHTML = ''; // remove the question mark on the first click
      isFirstClick = false;
    }
    
    displayPhobia();
  });
});

// automatically play audio after a 2-second delay
window.addEventListener('load', function() {
  setTimeout(function() {
    console.log('Automatically playing audio after 2 seconds'); // console log statement
    playAudio();
  }, 2000); // 2 seconds
});

// Play button click event listener
const playButton = document.querySelector('.play-button');
playButton.addEventListener('click', function() {
  console.log('Play button clicked'); // Console log statement for testing
  playAudio();
});

// Function to play audio
function playAudio() {
  if (audioInstance && !audioInstance.paused) {
    console.log('Audio is already playing'); // Console log statement
    return; // return if already playing so do nothing
  }

  const match = window.location.pathname.match(/door(\d+)\.html/);
  if (match) {
    const doorNumber = match[1];
    audioInstance = new Audio(`audio/door${doorNumber}.mp3`);
    audioInstance.play().catch(function(error) {
      console.error('Failed to play audio:', error); // Console log statement
    });
  } else {
    console.warn('doesnt'); // Console log statement
  }
}

const doorContainer = document.querySelector('.door-container');
const doorsWrapper = document.querySelector('.doors-wrapper');

let isDragging = false;
let startX;
let scrollLeft;

doorContainer.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.pageX - doorContainer.offsetLeft;
  scrollLeft = doorContainer.scrollLeft;
});

doorContainer.addEventListener('mouseleave', () => {
  isDragging = false;
});

doorContainer.addEventListener('mouseup', () => {
  isDragging = false;
});

doorContainer.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const x = e.pageX - doorContainer.offsetLeft;
  const walk = (x - startX) * 2; // scroll speed 
  doorContainer.scrollLeft = scrollLeft - walk;
});