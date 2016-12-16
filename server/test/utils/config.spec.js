/**
 * Created by @author jonas on 2016-11-27.
 *
 * Copyright 2016 (C) jonas
 * License: MIT
 */

/* eslint handle-callback-err: 0 */

const assert = require('assert');
const mockery = require('mockery');
const path = require('path');

describe('utils/config', () => {
  beforeEach('set test data file', () => {
    process.env.CONFIGFILE = path.join(__dirname, '/test-config.json');
  });

  let config;

  let telldusApiMock = {
    listDevices: cb => {
      return cb(null, require('./telldus-devices'));
    }
  };

  beforeEach('load config fresh', () => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    mockery.registerMock('../telldus-api', telldusApiMock);
    config = require('../../src/utils/config');
  });

  afterEach('uninstall mockery', () => {
    mockery.disable();
  });

  describe('#clientConfig', () => {
    it('objects should have an id', done => {
      config.clientConfig((err, data) => {
        assert('groups' in data);
        assert('id' in data.groups[0]);
        assert('controls' in data.groups[0]);
        assert('id' in data.groups[0].controls[0]);
        done();
      });
    });

    describe('enableSwitchAll', () => {
      it('should have been set in all group objects', done => {
        config.clientConfig((err, data) => {
          assert('enableSwitchAll' in data.groups[0]);
          assert('enableSwitchAll' in data.groups[1]);
          done();
        });
      });

      it('should default to true if not set', done => {
        config.clientConfig((erro, data) => {
          assert('enableSwitchAll' in data.groups[0]);
          assert.equal(data.groups[0].enableSwitchAll, true);
          done();
        });
      });

      it('should be set to false explicitly', done => {
        config.clientConfig((err, data) => {
          assert('enableSwitchAll' in data.groups[1]);
          assert.equal(data.groups[1].enableSwitchAll, false);
          done();
        });
      });
    });

    describe('type', () => {
      it('should have a type property', done => {
        config.clientConfig((err, data) => {
          assert('type' in data.groups[0].controls[0]);
          assert('type' in data.groups[1].controls[0]);
          done();
        });
      });
      it('the device should be a dimmer', done => {
        config.clientConfig((err, data) => {
          assert.equal(data.groups[0].controls[1].type, 'dimmer');
          done();
        });
      });
      it('the device should be a switch', done => {
        config.clientConfig((err, data) => {
          assert.equal(data.groups[1].controls[0].type, 'switch');
          done();
        });
      });
    });

    describe('#controlDescription', () => {
      let clientConfig;

      beforeEach('load client config', done => {
        config.clientConfig((err, data) => {
          clientConfig = data;
          done();
        });
      });

      it('should return the proper object', () => {
        let cc = clientConfig.groups[0].controls[0];
        assert.equal(cc.caption, 'Lampor Plan 1');

        let c = config.controlDescription(cc.id);
        assert.equal(c.backend, 'telldus');
        assert.equal(c.device_id, 1283624);
      });
    });
  });
});
