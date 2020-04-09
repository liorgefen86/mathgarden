const OUTPUT_SIZE = 20;
var model;

async function loadModel() {
    model = await tf.loadGraphModel('TFJS/model.json');
}

function predictImage() {
    //console.log('Processing...');

    let image = cv.imread(canvas);
    cv.cvtColor(image,image, cv.COLOR_RGBA2GRAY);
    cv.threshold(image, image, 150, 255, cv.THRESH_BINARY);

    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

    let cnt = contours.get(0);
    let rect = cv.boundingRect(cnt);

    image = image.roi(rect);

    let height = image.rows;
    let width = image.cols;

    if (height > width) {
        height = OUTPUT_SIZE;
        let scaleFactor = image.rows / height;
        width = Math.round(image.cols / scaleFactor);
    } else {
        width = OUTPUT_SIZE;
        let scaleFactor = image.cols / width;
        height = Math.round(image.rows / scaleFactor);
    }

    let newSize = new cv.Size(width, height);

    cv.resize(image, image, newSize, 0, 0, cv.INTER_AREA);

    const LEFT = Math.ceil(4 + (OUTPUT_SIZE - width) / 2);
    const RIGHT = Math.floor(4 + (OUTPUT_SIZE - width) / 2);
    const TOP = Math.ceil(4 + (OUTPUT_SIZE - height) / 2);
    const BOTTOM = Math.floor(4 + (OUTPUT_SIZE - height) / 2);

    const PADDING_COLOR = new cv.Scalar(0, 0, 0, 0);

    cv.copyMakeBorder(image, image, TOP, BOTTOM, LEFT, RIGHT, cv.BORDER_CONSTANT, PADDING_COLOR);

    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    cnt = contours.get(0);
    const Moments = cv.moments(cnt, false);

    const cx = Moments.m10 / Moments.m00;
    const cy = Moments.m01 / Moments.m00;

    const SHIFT_X = Math.round(image.cols / 2.0 - cx);
    const SHIFT_Y = Math.round(image.rows / 2.0 - cy);

    let M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, SHIFT_X, 0, 1, SHIFT_Y]);
    newSize = new cv.Size(image.rows, image.cols);
    cv.warpAffine(image, image, M, newSize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());

    let pixelValues = Float32Array.from(image.data);
    pixelValues = pixelValues.map(function (item) {
        return item / 255.0;
    });

    const X = tf.tensor([pixelValues]);
    //console.log(`Shape of Tensor: ${X.shape}`);
    //console.log(`dtype of Tensor: ${X.dtype}`);

    const result = model.predict(X);
    //result.print();

    const output = result.dataSync();

    //const outputCanvas = document.createElement('CANVAS');

    //cv.imshow(outputCanvas, image);
    //document.body.appendChild(outputCanvas);

    M.delete();
    image.delete();
    contours.delete();
    cnt.delete();
    hierarchy.delete();
    X.dispose();
    result.dispose();

    return output;
}