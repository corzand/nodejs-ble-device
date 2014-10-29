var temperature,
    humidity,
    lastUpdate;

var sensorLib = require('node-dht-sensor');
var sensor = {
    initialize: function () {
        //GPIO pin 23
        if (sensorLib.initialize(22, 23)) {
            sensor.read();
            return true;
        } else {
            return false;
        }
    },
    read: function () {
        var readout = sensorLib.read();

        temperature = readout.temperature.toFixed(2);
        humidity = readout.humidity.toFixed(2);
        lastUpdate = new Date();

        setTimeout(function () {
            sensor.read();
        }, 2000);
    }
};

/*mock
var sensor = {
    initialize: function () {
        sensor.read();
        return true;
    },
    read: function () {

        temperature = 20;
        humidity = 45;
    }
};
*/


function getHumidity() {
    return humidity;
}

function getTemperature() {
    return temperature;
}

function getLastUpdateDate() {
    return lastUpdate;
}

exports.isInitialized = function () {
    return sensor.initialize();
}
exports.getTemperature = getTemperature;
exports.getHumidity = getHumidity;
exports.getLastUpdateDate = getLastUpdateDate;