"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var defineSupportCode = require('cucumber').defineSupportCode;
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var expect = chai.expect;
var protractor_1 = require("protractor");
defineSupportCode(function (_a) {
    var Given = _a.Given, Then = _a.Then, When = _a.When;
    Given('I am on the task list page', function () {
        return protractor_1.browser.get("/task-list").then(function () {
            protractor_1.browser.sleep(5000);
        });
    });
});
//# sourceMappingURL=task-list.steps.js.map