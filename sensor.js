var temperature,
    humidity,
    lastUpdate;

/*
var sensorLib = require('node-dht-sensor');
var sensor = {
    initialize: function () {
        return sensorLib.initialize(22, 4);
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
};*/

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


function getHumidity() {
    return humidity;
}

function getTemperature() {
    return temperature;
}

function getLastUpdateDate() {
    return new Date();
}

exports.isInitialized = function () {
    return sensor.initialize();
}
exports.getTemperature = getTemperature;
exports.getHumidity = getHumidity;
exports.getLastUpdateDate = getLastUpdateDate;