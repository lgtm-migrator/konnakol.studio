import { PATTERNS } from './constants.js'

const pitch = document.getElementById('pitch')
let audioSource, audioContext, scriptProcessor;
let count = 0;
let index = 0;
let passed = false;
let color = 'darkgrey'
let currentUnit = null
let interval = null
let tempo = 200
const maxFrequency = 2000;
const bufferSize = 1 << 12;
const size = bufferSize / (1 << 10);

const CURRENT_PATTERN = PATTERNS.Seven

run()

const track = document.querySelector('#track')
CURRENT_PATTERN.forEach((unit) => {
  track.insertAdjacentHTML('beforeend', `<div class="unit">${unit?.symbol ?? '.'}</div>`)
})
const units = document.querySelectorAll('#track .unit');

const setTempo = document.getElementById('tempo')

setTempo.addEventListener('click', () => {
  const newTempo = prompt('New tempo (BPM)', parseInt(1000 / tempo * 60))

  tempo = 1000 / (+newTempo / 60)

  clearInterval(interval)
  interval = setInterval(intervalFunction, tempo)

  console.log({ tempo })
})

function paintColor(color) {
  if (index > 0) {
    units.item(index - 1).style.textDecoration = 'none'
    units.item(index - 1).style.color = 'lightgrey'
  }

  if (index === 0) {
    units.item(CURRENT_PATTERN.length - 1).style.textDecoration = 'none'
    units.item(CURRENT_PATTERN.length - 1).style.color = 'lightgrey'
  }

  units.item(index).style.textDecoration = 'underline'
  units.item(index).style.color = color
}

function intervalFunction() {
  if (index >= CURRENT_PATTERN.length - 1) {
    index = 0
  } else {
    index++
  }

  passed = false;
  currentUnit = CURRENT_PATTERN[index]
}


async function run() {
  // if (audioContext) return;

  audioContext = new (AudioContext || webkitAudioContext)();
  audioContext.resume()
  scriptProcessor = audioContext.createScriptProcessor(bufferSize, 1, 1);

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

  audioSource = audioContext.createMediaStreamSource(stream);


  audioSource.connect(scriptProcessor);
  // audioSource.connect(audioContext.destination);

  console.log(audioContext)

  scriptProcessor.connect(audioContext.destination);

  const $canvas = document.querySelector("canvas");
  const canvasContext = $canvas.getContext("2d");
  $canvas.width = document.body.clientWidth;
  $canvas.height = document.body.clientHeight / 2;

  aubio().then(({ Pitch }) => {
    currentUnit = CURRENT_PATTERN[index]

    interval = setInterval(intervalFunction, tempo)

    const pitchDetector = new Pitch(
      "default",
      scriptProcessor.bufferSize,
      scriptProcessor.bufferSize / 8,
      audioContext.sampleRate
    );
    scriptProcessor.addEventListener("audioprocess", function (event) {
      // if (audio.paused) return;

      const data = event.inputBuffer.getChannelData(0);
      const frequency = pitchDetector.do(data);
      const x = (count * size) % $canvas.width;
      if (x < size) {
        canvasContext.clearRect(0, 0, $canvas.width, $canvas.height);
        canvasContext.beginPath();
      }

      if (frequency) {
        pitch.innerHTML = frequency.toFixed(1) + " Hz";
        const y =
          $canvas.height - (frequency / maxFrequency) * $canvas.height;
        canvasContext.lineTo(x, y);
        canvasContext.stroke();
      }

      const isFrequencyMatched = (
        frequency > currentUnit?.range?.from &&
        frequency < currentUnit?.range?.to
      )

      console.log(isFrequencyMatched)

      if (isFrequencyMatched) {
        passed = true;
        paintColor('lightgreen')
      } else if (currentUnit === null) {
        passed = true;
        paintColor('darkgrey')
      } else if (!passed) {
        paintColor('red')
      }

      count += 1;
    });
  });
}
