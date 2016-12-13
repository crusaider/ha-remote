/**
 * Created by @author jonas on 2016-11-27.
 *
 * Copyright 2016 (C) jonas
 * License: MIT
 */

const assert = require('assert');
const mockery = require('mockery');
const path = require('path');

describe('config', () => {
  beforeEach('set test data file', () => {
    process.env.CONFIGFILE = path.join(__dirname, '/test-config.json');
  });

  let config;

  beforeEach('load config fresh', () => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    config = require('../../src/utils/config');
  });

  afterEach('uninstall mockery', () => {
    mockery.disable();
  });

  describe('#clientConfig', () => {
    it('objects should have an id', () => {
      let data = config.clientConfig();

      assert('groups' in data);
      assert('id' in data.groups[0]);
      assert('controls' in data.groups[0]);
      assert('id' in data.groups[0].controls[0]);
    });

    describe('enableSwitchAll', () => {
      it('should have been set in all group objects', () => {
        let data = config.clientConfig();

        assert('enableSwitchAll' in data.groups[0]);
        assert('enableSwitchAll' in data.groups[1]);
      });

      it('should default to true if not set', () => {
        let data = config.clientConfig();

        assert('enableSwitchAll' in data.groups[0]);
        assert.equal(data.groups[0].enableSwitchAll, true);
      });

      it('should be set to false explicitly', () => {
        let data = config.clientConfig();

        assert('enableSwitchAll' in data.groups[1]);
        assert.equal(data.groups[1].enableSwitchAll, false);
      });
    });
  });

  describe('#controlDescription', () => {
    let clientConfig;

    beforeEach('load client config', () => {
      clientConfig = config.clientConfig();
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
