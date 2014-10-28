var util = require('util'),
    bleno = require('bleno'),
    sensor = null,
    readyCallback = null;


var BlenoPrimaryService = bleno.PrimaryService;
var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

var TemperatureCharacteristic = function () {
    TemperatureCharacteristic.super_.call(this, {
        uuid: '3A00fffffffffffffffffffffffffff1',
        properties: ['read'],
        descriptors: [
            new BlenoDescriptor({
                uuid: '2904',
                value: new Buffer([0x04, 0x00, 0x2F, 0x27, 0x01, 0x00, 0x00])
            })
        ],
        onReadRequest: function (offset, callback) {
            var result = this.RESULT_SUCCESS;
            var data = new Buffer(4);
            data.writeUInt32LE(sensor.getTemperature(), 0);

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
                value: new Buffer([0x04, 0x00, 0xAD, 0x27, 0x01, 0x00, 0x00])
            })
        ],
        onReadRequest: function (offset, callback) {
            var result = this.RESULT_SUCCESS;
            var data = new Buffer(4);
            data.writeUInt32LE(sensor.getHumidity(), 0);

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
            var data = new Buffer(7);

            var date = sensor.getLastUpdateDate();
            console.log(date);

            data.writeUInt16LE(date.getFullYear(), 0);
            data.writeUInt8(date.getMonth(), 2);
            data.writeUInt8(date.getDate(), 3);
            data.writeUInt8(date.getHours(), 4);
            data.writeUInt8(date.getMinutes(), 5);
            data.writeUInt8(date.getSeconds(), 6);

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