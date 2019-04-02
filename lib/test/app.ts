import devasys = require("../../src/DevasysI2C");

var device = new devasys.DevasysI2C(false);

// Get Dll Version
var dllVersion = device.GetDllVersion();
console.log('dllVersion :' + dllVersion);

// Open device
device.Open();

// WriteI2C
// first parameter - i2c address,
// second parameter - array of bytes to write
var count = device.WriteI2C(0xF0, [0x10, 0xE0]);
var count = device.WriteI2C(0xF0, [0x21]);

// ReadI2C
// first parameter - i2c address
// second parameter - number of bytes to read
// returns array of bytes with result

var result = device.ReadI2C(0xF0, 1);
