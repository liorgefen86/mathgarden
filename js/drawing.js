const BACKGROUND_COLOR = '#1b2536';
const LINE_COLOR = '#ffffff';
const LINE_WIDTH = 10;

var isEmpty;
var currentX = 0;
var currentY = 0;
var previousX = 0;
var previousY = 0;
var btn_pressed = false;
var canvas;
var context;

var CANVAS_WIDTH;
var CANVAS_HEIGHT;

function prepareCanvas() {
    //console.log('Preparing canvas...')
    canvas = document.getElementById('my-canvas');
    CANVAS_WIDTH = canvas.clientWidth;
    CANVAS_HEIGHT = canvas.clientHeight;

    context = canvas.getContext('2d');

    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    context.strokeStyle = LINE_COLOR;
    context.lineWidth = LINE_WIDTH;
    context.lineJoin = 'round';

    isEmpty = true;

    mouse_events();
    touch_events();
}

function touch_events() {
    canvas.addEventListener('touchcancel', function () {
        btn_pressed = false;
    });

    canvas.addEventListener('touchstart', function (event) {
        currentX = event.touches[0].clientX - canvas.offsetLeft;
        currentY = event.touches[0].clientY - canvas.offsetTop;
        btn_pressed = true;
    });

    canvas.addEventListener('touchend', function () {
        btn_pressed = false;
    });

    canvas.addEventListener('touchmove', function (event) {

        if (btn_pressed){ //inside_canvas
            isEmpty = false;
            if ((currentX <= CANVAS_WIDTH && currentY <= CANVAS_HEIGHT) &&
                (currentX >= 0 && currentY >= 0)) {
                update_locations_touch(event, canvas, currentX, currentY);

                draw(context);
            } else {
                btn_pressed = false;
            }

        }
    });
}

function mouse_events() {
    canvas.addEventListener('mouseup', function () {
        btn_pressed = false;
    });

    canvas.addEventListener('mousedown', function (event) {
        currentX = event.pageX - canvas.offsetLeft;
        currentY = event.pageY - canvas.offsetTop;
        btn_pressed = true;
    });

    canvas.addEventListener('mouseleave', function () {
        btn_pressed = false;
    });

    canvas.addEventListener('mousemove', function (event) {

        if (btn_pressed){ //inside_canvas
            isEmpty = false;
            update_locations(event, canvas, currentX, currentY);

            draw(context);
        }
    });
}

function draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(previousX, previousY);
        ctx.lineTo(currentX, currentY);
        ctx.closePath();
        ctx.stroke();
}

function update_locations_touch(event, canvas) {
    previousX = currentX;
    previousY = currentY;

    currentX = event.touches[0].clientX - canvas.offsetLeft;
    currentY = event.touches[0].clientY - canvas.offsetTop;
}

function update_locations(event, canvas) {
    previousX = currentX;
    previousY = currentY;

    currentX = event.pageX - canvas.offsetLeft;
    currentY = event.pageY - canvas.offsetTop;
}

function clearCanvas() {
    currentX = 0;
    currentY = 0;
    previousX = 0;
    previousY = 0;
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    isEmpty = true;
}