/**
 * Keeps track of devices and their states.
 */
'use strict';

module.exports = {

    /**
     * Tells of a entity exists.
     * 
     * @param entity_id 
     * @returns true if it exists, false if not.
     */
    exists: function (entity_id) {
        return getDeviceIndex(entity_id) != -1;
    },

    /**
     * Sets the state of the entity to "on".
     * 
     * @param entity_id (description)
     */
    switchOn: function (entity_id) {
        devices[getDeviceIndex(entity_id)].state = "on";
    },

    switchOff: function (entity_id) {
        devices[getDeviceIndex(entity_id)].state = "off";
    },

    getState: function (entity_id) {
        var index = getDeviceIndex(entity_id);
        if ( index == -1 ) {
            return undefined;
        }
        return devices[index].state;
    }
}

function getDeviceIndex(entity_id) {
    for (var i = 0; i < devices.length; i++) {
        if (devices[i].entity_id == entity_id) {
            return i;
        }
    }

    return -1;
}


var devices =
    [
        {
            entity_id: "group.vardagsrum",
            state: "off"
        },
        {
            entity_id: "group.kontor",
            state: "off"
        },
        {
            entity_id: "group.allrum",
            state: "off"
        },
        {
            entity_id: "group.sovrum__gstrum",
            state: "off"
        },
    ]
    ;


