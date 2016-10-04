'use strict';

var express = require('express');
var fs = require('fs');
var logger = require('../utils/logger');



var router = express.Router();

router.route('/')

  //
  // Get the configuration s

  .get(function (req, res) {

    var aboutInfo = {
      copyrightYear: 2016,
      copyrightHolders: 'Jonas Andreasson',
      version: readPackageInfo('package.json').version,
      modules: []
    };

    aboutInfo.modules = aboutInfo.modules.concat(readDepencyInfos('.'));

    res.json(aboutInfo);
  });

module.exports = router;

function readDepencyInfos(packageDir) {
  var packageJson = loadPackageJson(packageDir.concat('/package.json'));

  var packageInfos = [];

  for (var packageName in packageJson.dependencies) {
    packageInfos.push(readPackageInfo(packageDir.concat('/node_modules/').concat(packageName).concat('/package.json')));
  }

  return packageInfos;
}

function readPackageInfo(filename) {
  var packageInfo = loadPackageJson(filename);
  return { name: packageInfo.name, version: packageInfo.version };
}

function loadPackageJson(filename) {
  var packageInfo;

  try {
    packageInfo = JSON.parse(fs.readFileSync(filename, 'utf8'));
    logger.debug("Loading package info from [%s]", fs.realpathSync(filename));
  } catch (err) {
    logger.error("Failed to load package info from file [%s]", filename);
    logger.error(err);
    throw (err);
  }

  return packageInfo;
}
