"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.DevasysI2C = void 0;
var ffi = require("ffi-napi");
var ref = require("ref-napi");
var Struct = require("ref-struct-napi");
var ArrayType = require("ref-array-napi");
var DevasysI2C = /** @class */ (function () {
    function DevasysI2C(showDebugInfo) {
        if (showDebugInfo === void 0) { showDebugInfo = true; }
        this.DAPI_I2C_TRANS_DAMP = Struct({
            'byType': 'byte',
            'byDevId': 'byte',
            'wMemAddr': 'int16',
            'wCount': 'int16',
            'Data': ArrayType('byte', 30)
        });
        this.InitFFI();
        this.Open();
        this.handle = 0;
        this.showDebugInfo = showDebugInfo;
    }
    DevasysI2C.prototype.InitFFI = function () {
        var int16Ptr = ref.refType('int16');
        var DAPI_I2C_TRANS_DAMPPtr = ref.refType(this.DAPI_I2C_TRANS_DAMP);
        this.libi2c = ffi.Library('usbi2cio', {
            'DAPI_GetDllVersion': ['int', []],
            // public static extern int DAPI_OpenDeviceInstance(string lpsDevName, byte byDevInstance);
            'DAPI_OpenDeviceInstance': ['int', ['string', 'byte']],
            // public static extern bool DAPI_GetFirmwareVersion(IntPtr hDevInstance, ref DAPI_WORD pwVersion);
            'DAPI_GetFirmwareVersion': ['bool', ['int', int16Ptr]],
            // public static extern int DAPI_ReadI2c(IntPtr hDevInstance, ref DAPI_I2C_TRANS_Long TransI2c);
            'DAPI_ReadI2c': ['bool', ['int', DAPI_I2C_TRANS_DAMPPtr]],
            // public static extern int DAPI_WriteI2c(IntPtr hDevInstance, ref DAPI_I2C_TRANS TransI2c);
            'DAPI_WriteI2c': ['int', ['int', DAPI_I2C_TRANS_DAMPPtr]]
        });
    };
    DevasysI2C.prototype.ToHexString = function (byteArray) {
        return '[' + Array.from(byteArray, function (byte) {
            return '0x' + ('0' + (byte & 0xFF).toString(16)).slice(-2);
        }).join(', ') + ']';
    };
    DevasysI2C.prototype.ReadI2C = function (devAddr, numOfBytes) {
        var I2CTransRef = ref.alloc(this.DAPI_I2C_TRANS_DAMP);
        I2CTransRef[0] = 0; // type
        I2CTransRef[1] = devAddr; // dev addr
        I2CTransRef[4] = numOfBytes; // count
        var result = this.libi2c.DAPI_ReadI2c(this.handle, I2CTransRef);
        var arr = __spreadArray([], I2CTransRef, true);
        var arr_sliced = arr.slice(6, 6 + numOfBytes);
        if (this.showDebugInfo)
            console.log("READ [0x" + devAddr.toString(16) + "]: " + this.ToHexString(arr_sliced));
        return arr_sliced;
    };
    DevasysI2C.prototype.WriteI2C = function (devAddr, data) {
        var I2CTransRef = ref.alloc(this.DAPI_I2C_TRANS_DAMP);
        I2CTransRef[0] = 0; // type
        I2CTransRef[1] = devAddr; // dev addr
        I2CTransRef[4] = data.length; // count
        for (var i = 0; i < data.length; i++) {
            I2CTransRef[i + 6] = data[i];
        }
        var result = this.libi2c.DAPI_WriteI2c(this.handle, I2CTransRef);
        if (this.showDebugInfo)
            console.log("WRITE [0x" + devAddr.toString(16) + "]: " + this.ToHexString(data));
        return result;
    };
    DevasysI2C.prototype.Open = function () {
        this.handle = this.libi2c.DAPI_OpenDeviceInstance("UsbI2cIo", 0);
    };
    DevasysI2C.prototype.GetDllVersion = function () {
        return this.libi2c.DAPI_GetDllVersion();
    };
    DevasysI2C.prototype.GetFWVersion = function () {
        var version = ref.alloc('int16');
        return this.libi2c.DAPI_GetFirmwareVersion(this.handle, version);
    };
    return DevasysI2C;
}());
exports.DevasysI2C = DevasysI2C;
//# sourceMappingURL=DevasysI2C.js.map