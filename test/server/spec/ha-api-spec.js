/**
 * Test the ha-api module
 */

describe("ha-api", function () {
    var haApi = require('../../../src/ha-api');

    describe("API configuration", function () {
        it("The default HA url should be set", function () {
            expect(haApi.url).toEqual("http://localhost:8123");
        })

        it("The default HA password should be a empty string", function () {
            expect(haApi.password).toEqual("");
        })
    });

var sinon = require('sinon');
var PassThrough = require('stream').PassThrough;
var http = require('http');
 
describe('api functions', function() {
	beforeEach(function() {
		this.request = sinon.stub(http, 'request');
	});
 
	afterEach(function() {
		http.request.restore();
	});
 
 
	//We will place our tests cases here
 
});


});
