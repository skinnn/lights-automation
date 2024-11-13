const cv = require('opencv4nodejs');
const { detectFaces } = require('./helpers.js');
const server = require('http').createServer();
const options = {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
};
const io = require('socket.io')(server, options);
const PORT = 3000;

const fps = 40;
const videoSource = 0;
const videoCap = new cv.VideoCapture(videoSource);
videoCap.set(cv.CAP_PROP_FRAME_WIDTH, 640);
videoCap.set(cv.CAP_PROP_FRAME_HEIGHT, 480);

server.listen(PORT, () => {
	console.log(`Waiting for socket connection on port ${PORT}`);

	io.on('connect', (socket) => {
		console.log('connected', socket.id);
	
		// Live feed
		setInterval(() => {
			const frame = videoCap.read();
			const image = cv.imencode('.jpg', frame).toString('base64');
			io.emit('new-frame', { live: image });
		}, 1000 / fps);
	
		// Feed with detected faces
		setInterval(() => {
			const frame = videoCap.read();
			const faces = detectFaces(frame);
			const imageWithFaces = cv.imencode('.jpg', frame).toString('base64');
			io.emit('new-frame', {
				transformed: imageWithFaces,
				// transformationData: calculatePeoplePosition(frame, faces)
			});
		}, 10000 / fps);

	});
});