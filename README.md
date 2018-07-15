# Car with camera controlled by Raspberry Pi through WiFi


## Hardware requirements
1. Raspberry Pi (any model).
2. DC motor (2, one for left wheel and one for right wheel).
3. L298N motor driver (or L293D motor driver).
4. Chasis for the car.
5. Wheel (4, should be operable with the DC motor).
6. Camera (USB camera).

## Software requirements
1. NodeJs.
2. Node package manager.
3. Pi GPIO.
4. Motion.

Run the below commands in terminal to fetch all software requirements
```
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install npm
sudo apt-get install pigpio
sudo apt-get install motion
```

## Hardware setup
1. Choose GPIO pins.
2. Connect RaspberryPi with DC motor through motor driver.
3. Connect camera via USB.

### Choose GPIO pins
Select 4 GPIO pins to send signals to the motor driver.
For example: GPIO6 Pin 31, GPIO13 Pin 33, GPIO19 Pin 35, GPIO26 Pin 37 in Pi3 B+.

### Connect RaspberryPi with DC motor through motor driver
Connect 4 GPIO pins to 4 input pins in the motor driver.
Connect 2 DC motors to motor pins in the motor driver.

## Software setup
1. Configure motion service.
2. Clone repository.

### Configure motion service
Change motion defaults:
Run below commands in terminal
```
sudo cp /etc/default/motion /etc/default/motion.bak
sudo nano /etc/default/motion
```
In motion file, set the below defaults
- start_motion_daemon=yes

Change motion configuration:
Run below commands in terminal
```
sudo cp /etc/motion/motion.conf /etc/motion/motion.conf.bak
sudo nano /etc/motion/motion.conf
```
In motion.conf file, set the below configurations
- daemon on
- stream_localhost off
- framerate 60
- width 640
- height 480
- auto_brightness on
- stream_quality 75

Once the configuration is complete, run below command in terminal
```
sudo service motion start
```

### Clone repository
Run below commands in terminal:
```
git clone https://github.com/SureshGowthamS/camera-car-raspberrypi-wifi.git
cd camera-car-raspberrypi-wifi
npm install
```
> If required, edit the pins in server.js

## Driving the car
1. Run the web service.
2. Control with browser.

### Run the web service
Run below commands in terminal
```
sudo npm start
```

### Control with browser
1. Find the ip address of your RaspberryPi use `ifconfig`.
2. Browse to the controller page `http://<ip_address>:8082`.
