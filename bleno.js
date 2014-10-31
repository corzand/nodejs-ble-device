var util = require('util'),
    bleno = require('bleno'),
    sensor = null,
    readyCallback = null;

//Patches bleno weaknesses (kills opened l2cap-ble after closing)!
require('./bleno-patch');

var BlenoPrimaryService = bleno.PrimaryService;
var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

var TemperatureCharacteristic = function () {
    TemperatureCharacteristic.super_.call(this, {
        uuid: '3A00fffffffffffffffffffffffffff0',
        properties: ['read'],
        descriptors: [
            new BlenoDescriptor({
                uuid: '2904',
                value: new Buffer([0x14, 0x00, 0x2F, 0x27, 0x01, 0x00, 0x00])
            })
        ],
        onReadRequest: function (offset, callback) {
            var result = this.RESULT_SUCCESS;
            var data = sensor.getTemperature();

            if (offset > data.length) {
                result = this.RESULT_INVALID_OFFSET;
                data = null;
            }

            callback(result, data);
        }
    });
};

util.inherits(TemperatureCharacteristic, BlenoCharacteristic);

var HumidityCharacteristic = function () {
    HumidityCharacteristic.super_.call(this, {
        uuid: '3A01fffffffffffffffffffffffffff0',
        properties: ['read'],
        descriptors: [
            new BlenoDescriptor({
                uuid: '2904',
                value: new Buffer([0x14, 0x00, 0xAD, 0x27, 0x01, 0x00, 0x00])
            })
        ],
        onReadRequest: function (offset, callback) {
            var result = this.RESULT_SUCCESS;
            var data = sensor.getHumidity();

            if (offset > data.length) {
                result = this.RESULT_INVALID_OFFSET;
                data = null;
            }

            callback(result, data);
        }
    });
};

util.inherits(HumidityCharacteristic, BlenoCharacteristic);

var DateTimeCharacteristic = function () {
    DateTimeCharacteristic.super_.call(this, {
        uuid: '2A08',
        properties: ['read'],
        onReadRequest: function (offset, callback) {
            var result = this.RESULT_SUCCESS;

            var data = sensor.getLastUpdateDate();

            if (offset > data.length) {
                result = this.RESULT_INVALID_OFFSET;
                data = null;
            }

            callback(result, data);
        }
    });
};

util.inherits(DateTimeCharacteristic, BlenoCharacteristic);

function SampleService() {
    SampleService.super_.call(this, {
        uuid: '1816fffffffffffffffffffffffffff0',
        characteristics: [
            new TemperatureCharacteristic(),
            new HumidityCharacteristic(),
            new DateTimeCharacteristic()
        ]
    });
}

util.inherits(SampleService, BlenoPrimaryService);

bleno.on('stateChange', function (state) {
    console.log('on -> stateChange: ' + state);

    if (state === 'poweredOn') {
        readyCallback();
    } else {
        bleno.stopAdvertising();
    }
});

bleno.on('advertisingStart', function (error) {
    if (!error) {
        bleno.setServices([
      new SampleService()
    ]);
    }
});

exports.ready = function (cb) {
    readyCallback = cb;
};

exports.start = function (s) {
    sensor = s;
    bleno.startAdvertising('temperature service', ['1816fffffffffffffffffffffffffff0']);
};