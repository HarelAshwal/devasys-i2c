import { DevasysI2C } from "../DevasysI2C";

var device = new DevasysI2C();

test('Dll Version', () => {
    expect(device.GetDllVersion()).toBe(1280);
});
