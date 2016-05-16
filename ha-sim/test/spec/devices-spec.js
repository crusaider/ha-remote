/**
 * Test the devices module
 */

describe("devices", function () {
  var devices = require('../../src/devices');

  it("The device 'random' should not exist", function () {
    expect(devices.exists('random')).toEqual(false);
  });

  it("The device 'group.vardagsrum' should exist", function () {
    expect(devices.exists('group.vardagsrum')).toEqual(true);
  });

  it("State of 'random' should be 'undefined'", function () {
    expect(devices.getState('random')).toBeUndefined();
  });

  it("State of 'group.vardagsrum' should be 'off' by default", function () {
    expect(devices.getState('group.vardagsrum')).toEqual("off");
  });

  it("switching off 'random' should throw an exeption", function () {
    expect(function () {
      devices.switchOff('random');
    }).toThrow();
  });

  it("switching on 'random' should throw an exeption", function () {
    expect(function(){
      devices.switchOn('random');
    }).toThrow();
  });
  
  if("state of 'group.vardagsrum' should be 'on' once it has been swicthed on", function(){
    devices.switchOn('group.vardagsrum');
    expect(devices.getState('group.vardagsrum')).toEqual("on");
  });

  if("state of 'group.vardagsrum' should be 'off' once it has been swicthed off", function(){
    devices.switchOn('group.vardagsrum');
    expect(devices.getState('group.vardagsrum')).toEqual("on");
  });
});
