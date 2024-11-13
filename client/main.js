import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js';
import Fps from './Fps.js';

const socket = io('http://localhost:3000');

// DOM
const transformedCanvas = document.getElementById('transformed');
const tranCtx = transformedCanvas.getContext('2d', { alpha: false });
const liveFps = document.getElementById('live-fps');
const tranFpsCounter = new Fps();

const liveCanvas = document.getElementById('live');
const liveCtx = liveCanvas.getContext('2d', { alpha: false });
const tranFps = document.getElementById('tran-fps');
const liveFpsCounter = new Fps();

socket.on('connect', () => {
  console.log('connect', socket.id);
});

socket.on('disconnect', () => {
  console.log('disconnect');
});

socket.on('new-frame', ({ live, transformed}) => {
	// console.log('new frame');
	if (transformed) {
		const image = new Image();
		image.onload = () => {
			tranCtx.drawImage(image, 0, 0);
		};
		image.src = `data:image/jpeg;base64, ${transformed}`;
		tranFpsCounter.tick();
		tranFps.innerText = tranFpsCounter.value;
	}

	if (live) {
		const image = new Image();
		image.onload = () => {
			liveCtx.drawImage(image, 0, 0);
		};
		image.src = `data:image/jpeg;base64, ${live}`;
	}
	liveFpsCounter.tick();
	liveFps.innerText = liveFpsCounter.value;
});

