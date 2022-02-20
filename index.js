import { PATTERNS } from './constants.js'

const statusPicture = {
  success: "https://img.icons8.com/color/144/000000/checkmark--v3.png",
  fail: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIKdmlld0JveD0iMCAwIDE3MiAxNzIiCnN0eWxlPSIgZmlsbDojMDAwMDAwOyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWRhc2hhcnJheT0iIiBzdHJva2UtZGFzaG9mZnNldD0iMCIgZm9udC1mYW1pbHk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub25lIiBmb250LXNpemU9Im5vbmUiIHRleHQtYW5jaG9yPSJub25lIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PHBhdGggZD0iTTAsMTcydi0xNzJoMTcydjE3MnoiIGZpbGw9Im5vbmUiPjwvcGF0aD48ZyBpZD0ib3JpZ2luYWwtaWNvbiIgZmlsbD0iI2U3NGMzYyI+PHBhdGggZD0iTTMxLjQ5NzUsMjEuNzE1bC05Ljc4MjUsOS43ODI1bDU0LjUwMjUsNTQuNTAyNWwtNTQuODI1LDU0LjkzMjVsOS42NzUsOS42NzVsNTQuOTMyNSwtNTQuODI1bDU0LjgyNSw1NC44MjVsOS43ODI1LC05Ljc4MjVsLTU0LjgyNSwtNTQuODI1bDU0LjUwMjUsLTU0LjUwMjVsLTkuNzgyNSwtOS43ODI1bC01NC41MDI1LDU0LjUwMjV6Ij48L3BhdGg+PC9nPjwvZz48L3N2Zz4="
}

const statusElement = document.getElementById('status')
const successCount = document.getElementById('successCount')
const failedCount = document.getElementById('failedCount')


const setStatus = (status) => {
  if (!status) {
    return statusElement.style.opacity = 0
  }

  statusElement.style.opacity = 1
  statusElement.src = statusPicture[status]

  if (status === 'success') {
    successCount.textContent = +successCount.textContent + 1
  }

  if (status === 'fail') {
    failedCount.textContent = +failedCount.textContent + 1
  }
}

const pitch = document.getElementById('pitch')
let audioSource, audioContext, scriptProcessor;
let count = 0;
let index = 0;
let passed = false;
let isStatusSet = false;
let currentUnit = null
let interval = null
let tempo = 500
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

  tempo = 1000 / (+newTempo || tempo / 60)

  clearInterval(interval)
  interval = setInterval(intervalFunction, tempo)

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

  if (passed && !currentUnit) {
    setStatus(null)
  }

  if (!passed) {
    setStatus('fail')
  }

  passed = false;
  isStatusSet = false;
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

        if (!isStatusSet) {
          setStatus('success')
          isStatusSet = true
        }
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
