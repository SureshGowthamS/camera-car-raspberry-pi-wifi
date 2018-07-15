const Directions = {
    Stop: 0,
    Forward: 1,
    Backward: 2,
    Left: 3,
    Right: 4
}

// PiGPIO
var Gpio = require('pigpio').Gpio;

console.log('Initializing pins ...');

const Pins = {
    MotorLeftWheelForward: new Gpio(6, {
        mode: Gpio.OUTPUT
    }), // Pin 31
    MotorLeftWheelBackward: new Gpio(13, {
        mode: Gpio.OUTPUT
    }), // Pin 33
    MotorRightWheelForward: new Gpio(19, {
        mode: Gpio.OUTPUT
    }), // Pin 35
    MotorRightWheelBackward: new Gpio(26, {
        mode: Gpio.OUTPUT
    }) // Pin 37
}

function drive(direction, speed = 10) {
    var driveSuccessful = true;
    if (0 <= speed && speed <= 10) {
        var dutyCycle = speed * 25; // 0 - 250 (accepted range : 0 - 255)
        switch (parseInt(direction)) {
            case Directions.Stop:
                {
                    Pins.MotorLeftWheelForward.pwmWrite(0);
                    Pins.MotorLeftWheelBackward.pwmWrite(0);
                    Pins.MotorRightWheelForward.pwmWrite(0);
                    Pins.MotorRightWheelBackward.pwmWrite(0);
                    break;
                }
            case Directions.Forward:
                {
                    Pins.MotorLeftWheelForward.pwmWrite(dutyCycle);
                    Pins.MotorLeftWheelBackward.pwmWrite(0);
                    Pins.MotorRightWheelForward.pwmWrite(dutyCycle);
                    Pins.MotorRightWheelBackward.pwmWrite(0);
                    break;
                }
            case Directions.Backward:
                {
                    Pins.MotorLeftWheelForward.pwmWrite(0);
                    Pins.MotorLeftWheelBackward.pwmWrite(dutyCycle);
                    Pins.MotorRightWheelForward.pwmWrite(0);
                    Pins.MotorRightWheelBackward.pwmWrite(dutyCycle);
                    break;
                }
            case Directions.Left:
                {
                    Pins.MotorLeftWheelForward.pwmWrite(0);
                    Pins.MotorLeftWheelBackward.pwmWrite(0);
                    Pins.MotorRightWheelForward.pwmWrite(dutyCycle);
                    Pins.MotorRightWheelBackward.pwmWrite(0);
                    break;
                }
            case Directions.Right:
                {
                    Pins.MotorLeftWheelForward.pwmWrite(dutyCycle);
                    Pins.MotorLeftWheelBackward.pwmWrite(0);
                    Pins.MotorRightWheelForward.pwmWrite(0);
                    Pins.MotorRightWheelBackward.pwmWrite(0);
                    break;
                }
            default:
                driveSuccessful = false
        }
    }
    console.log('Drive (direction = ' + direction + ', speed = ' + speed + ')' + (driveSuccessful ? ' successful' : 'failure'));
    return driveSuccessful;
}

process.on('SIGINT', function () {
    drive(Directions.Stop);
    process.exit(0);
});

// Express server
var express = require('express');

console.log('Initializing sever ...');

var app = express();

app.use(express.static(__dirname));

app.get('/drive/:direction', function (request, response) {
    var direction = request.params.direction;
    response.status(drive(direction) ? 200 : 500).send('Direction ' + direction);
});

app.get('/drive/:direction/:speed', function (request, response) {
    var direction = request.params.direction;
    var speed = request.params.speed;
    response.status(drive(direction, speed) ? 200 : 500).send('Direction ' + direction + ' Speed ' + speed);
});

app.get('*', function (request, response) {
    response.status(401).send('Access denied');
});

app.use(function (error, request, response, next) {
    if (request.xhr) {
        response.status(500).send('Oops, Something went wrong!');
    } else {
        next(error);
    }
});

console.log('Running server ...');

var server = app.listen(8082 /* port to listen */ );
