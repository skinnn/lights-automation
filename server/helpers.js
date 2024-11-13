const cv = require('opencv4nodejs');

const drawFaces = (frame, faceRect) => {
	const rect = cv.drawDetection(frame, faceRect, {
		color: new cv.Vec(255, 0, 0),
		segmentFraction: 4
	});
};

const detectFaces = (frame) => {
	let faces = [];
	const image = frame.bgrToGray();
	const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
	const results = classifier.detectMultiScale(image);
	if (results.objects.length) {
		results.objects.forEach((faceRect, i) => {
			if (results.numDetections[i] < 1) return;

			drawFaces(frame, faceRect);
			faces.push(faceRect);
		});
	}
	return faces;
};

module.exports = {
	detectFaces
};