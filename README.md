nodejs-ble-device
=================

A custom bluetooth low energy device built on node.js.

This program is an exemple of how to turn a raspberry-pi in a bluetooth low energy ambient thermometer. 

It uses a DHT-22 sensor linked to GPIO pin #23 (see schema below).

Prerequisites
--------------

* Install last version of raspbian os on your raspberry-pi
* Open shell
* Install blueZ 4.101 from sources
```sh
sudo apt-get install libdbus-glib-1-dev
sudo apt-get install libexpat1-dev
wget http://www.kernel.org/pub/linux/bluetooth/bluez-4.101.tar.xz
tar -xvf bluez-4.101.tar.xz
cd bluez-4.101
./configure 
sudo make
sudo make install
```

* Test installation of blueZ:
```sh
hciconfig 
```
should results in something like:
```sh
hci0:   Type: BR/EDR  Bus: USB
         BD Address: 00:1A:7D:DA:71:0C  ACL MTU: 310:10  SCO MTU: 64:8
     DOWN 
     RX bytes:467 acl:0 sco:0 events:18 errors:0
     TX bytes:317 acl:0 sco:0 commands:18 errors:0 
```

* Install node.js (precompiled version)
```sh
sudo wget http://node-arm.herokuapp.com/node_latest_armhf.deb
sudo dpkg -i node_latest_armhf.deb
```

* Test installation of node.js
```sh
node -v 
```
should results in something like:
```sh
v0.10.24
```

* Install BCM2835 from sources
* (raspberry pi 2 requires version > 1.39)
```sh
sudo wget http://www.airspayce.com/mikem/bcm2835/bcm2835-1.xx.tar.gz
tar zxvf bcm2835-1.xx.tar.gz
cd bcm2835-1.xx
./configure
make
sudo make check
sudo make install
```

Installation
------------

* Clone repo of this project
```sh
git clone https://github.com/corzand/nodejs-ble-device.git
cd nodejs-ble-device
```

* Setup bluetoothd daemon as a startup service
```sh
git clone https://github.com/corzand/nodejs-ble-device.git
cd nodejs-ble-device
sudo cp bluetoothd.sh /etc/init.d/bluetoothd
sudo chmod uog+rx /etc/init.d/bluetoothd
sudo update-rc.d bluetoothd defaults
```
If you ever want to stop this service from executing on boot
```sh
sudo update-rc.d bluetoothd defaults
```

* Install npm packages
```sh
sudo npm install
```

Run
---

```sh
sudo node device.js
```

Note: Before running the program, turn off the raspberry pi and mount the GPIO circuit with DHT22 sensor and the resistor

![alt tag](http://s23.postimg.org/66wuemn0r/Screenshot_2014_10_30_22_42_55_1.png)
