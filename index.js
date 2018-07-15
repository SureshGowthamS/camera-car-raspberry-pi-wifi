var clickId = -1,
    currentSpeed = 0,
    currentDirection = 0;

document.addEventListener("DOMContentLoaded", init);
window.onorientationchange = setupController;
window.onresize = setupController;

function init() {
    var video = document.getElementById('video');
    videoFrame = document.createElement("iframe");
    videoFrame.setAttribute("src", document.location.protocol + "//" + document.location.hostname + ":8081/");
    videoFrame.setAttribute("style", "display:block;width:100%;height:100%");
    video.appendChild(videoFrame);

    var controller = document.getElementById('controller');
    controller.addEventListener('mousedown', onMouseDown, false);
    controller.addEventListener('touchstart', onTouchDown, false);
    controller.addEventListener('mousemove', onMouseMove, false);
    controller.addEventListener('touchmove', onTouchMove, false);
    controller.addEventListener('mouseup', onMouseUp, false);
    controller.addEventListener('touchend', onTouchUp, false);
    controller.addEventListener('mouseout', onMouseUp, false);
    controller.addEventListener('touchcancel', onTouchUp, false);
    setupController();
}

function setupController() {
    var context = controller.getContext("2d");
    var controllerWidth = controller.width;
    var controllerHeight = controller.height;
    context.clearRect(0, 0, controllerWidth, controllerHeight);
    context.fillStyle = "SkyBlue";
    context.fillRect(0, 0, controllerWidth * 1 / 4, controllerHeight); // LEFT
    context.fillStyle = "MediumBlue";
    context.fillRect(controllerWidth * 1 / 4, 0, controllerWidth * 3 / 4, controllerHeight * 1 / 4); // FORWARD HIGH
    context.fillStyle = "DodgerBlue";
    context.fillRect(controllerWidth * 1 / 4, controllerHeight * 1 / 4, controllerWidth * 3 / 4, controllerHeight * 2 / 4); // FORWARD LOW
    context.fillStyle = "DeepSkyBlue";
    context.fillRect(controllerWidth * 1 / 4, controllerHeight * 2 / 4, controllerWidth * 3 / 4, controllerHeight * 3 / 4); // BACKWARD LOW
    context.fillStyle = "LightSkyBlue";
    context.fillRect(controllerWidth * 1 / 4, controllerHeight * 3 / 4, controllerWidth * 3 / 4, controllerHeight); // BACKWARD HIGH
    context.fillStyle = "SkyBlue";
    context.fillRect(controllerWidth * 3 / 4, 0, controllerWidth, controllerHeight); // RIGHT
}

function onMouseDown(e) {
    if ((clickId == -1 || clickId == e.pointerId) && e.target == controller) {
        clickId = e.pointerId;
        var rect = controller.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var controllerWidth = controller.clientWidth;
        var controllerHeight = controller.clientHeight;
        if (x <= controllerWidth * 1 / 4) { // LEFT
            moveLeft();
        } else if (x >= controllerWidth * 3 / 4) { // RIGHT
            moveRight();
        } else if (y <= controllerHeight * 1 / 4) { // FORWARD HIGH
            moveForward(10);
        } else if (y <= controllerHeight * 2 / 4) { // FORWARD LOW
            moveForward(5);
        } else if (y <= controllerHeight * 3 / 4) { // BACKWARD LOW
            moveBackward(5);
        } else if (y <= controllerHeight) { //BACKWARD HIGH
            moveBackward(10);
        }
    }
}

function onTouchDown(e) {
    onMouseDown(e.changedTouches[0]);
    e.preventDefault();
}

function onMouseMove(e) {
    if (clickId == e.pointerId) {
        onMouseDown(e);
    }
}

function onTouchMove(e) {
    onMouseMove(e.changedTouches[0]);
    e.preventDefault();
}

function onMouseUp(e) {
    if (clickId == e.pointerId) {
        clickId = -1;
        stop();
    }
}

function onTouchUp(e) {
    onMouseUp(e.changedTouches[0]);
    e.preventDefault();
}

// FORWARD   1
// BACKWARD  2
// LEFT      3
// RIGHT     4
function moveForward(speed) {
    if (currentDirection != 1 || currentSpeed != speed) {
        currentDirection = 1;
        currentSpeed = speed;
        forwardOrBackward = currentDirection;
        drive();
    }
}

function moveBackward(speed) {
    if (currentDirection != 2 || currentSpeed != speed) {
        currentDirection = 2;
        currentSpeed = speed;
        forwardOrBackward = currentDirection;
        drive();
    }
}

function moveLeft() {
    if (currentDirection != 3) {
        currentDirection = 3;
        drive();
    }
}

function moveRight() {
    if (currentDirection != 4) {
        currentDirection = 4;
        drive();
    }
}

function stop() {
    currentDirection = 0;
    forwardOrBackward = 0;
    drive();
}

function drive() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", document.URL + 'drive/' + currentDirection + '/' + currentSpeed, false);
    xmlHttp.send(null);
}
