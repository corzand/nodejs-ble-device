var sensorService = require('./sensor'),
    bluetoothLowEnergyService = require('./bleno');

if (sensorService.isInitialized()) {
    bluetoothLowEnergyService.ready(function () {
        bluetoothLowEnergyService.start(sensorService);
    });
} else {
    console.warn('unable to start sensor');
}