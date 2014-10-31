var sensorLib = require('node-dht-sensor'),
    temperatureBytes = new Buffer(4),
    humidityBytes = new Buffer(4),
    lastUpdateBytes = new Buffer(7);

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

        var temperature = parseFloat(readout.temperature.toFixed(2));
        var humidity = parseFloat(readout.humidity.toFixed(2));
        var date = new Date();

        temperatureBytes.writeFloatLE(temperature, 0);

        humidityBytes.writeFloatLE(humidity, 0);

        lastUpdateBytes.writeUInt16LE(date.getFullYear(), 0);
        lastUpdateBytes.writeUInt8(date.getMonth(), 2);
        lastUpdateBytes.writeUInt8(date.getDate(), 3);
        lastUpdateBytes.writeUInt8(date.getHours(), 4);
        lastUpdateBytes.writeUInt8(date.getMinutes(), 5);
        lastUpdateBytes.writeUInt8(date.getSeconds(), 6);

        //console.log(temperatureBytes, humidityBytes, lastUpdateBytes);
        //console.log(temperature, humidity, date);

        setTimeout(function () {
            sensor.read();
        }, 2000);
    }
};

function getHumidity() {
    return humidityBytes;
}

function getTemperature() {
    return temperatureBytes;
}

function getLastUpdateDate() {
    return lastUpdateBytes;
}

exports.isInitialized = function () {
    return sensor.initialize();
}
exports.getTemperature = getTemperature;
exports.getHumidity = getHumidity;
exports.getLastUpdateDate = getLastUpdateDate;