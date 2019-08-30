"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var rp = require("request-promise-native");
var fs = require("fs");
var fusionAuth_1 = require("./fusionAuth");
var PortalApi = /** @class */ (function () {
    function PortalApi(host, resource) {
        this.serverHost = host.replace(/\/$/, '');
        this.resource = resource;
    }
    PortalApi.prototype.uploadFrameworkBundleAsync = function (bundlePath) {
        return __awaiter(this, void 0, void 0, function () {
            var endpoint, bundleContent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        endpoint = this.serverHost + "/bundles/frameworks";
                        return [4 /*yield*/, this.readBundleFile(bundlePath)];
                    case 1:
                        bundleContent = _a.sent();
                        return [4 /*yield*/, this.uploadBundleAsync(endpoint, bundleContent)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PortalApi.prototype.uploadAppBundleAsync = function (bundlePath) {
        return __awaiter(this, void 0, void 0, function () {
            var endpoint, bundleContent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        endpoint = this.serverHost + "/bundles/apps";
                        return [4 /*yield*/, this.readBundleFile(bundlePath)];
                    case 1:
                        bundleContent = _a.sent();
                        return [4 /*yield*/, this.uploadBundleAsync(endpoint, bundleContent)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PortalApi.prototype.uploadTileBundleAsync = function (bundlePath) {
        return __awaiter(this, void 0, void 0, function () {
            var endpoint, bundleContent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        endpoint = this.serverHost + "/bundles/tiles";
                        return [4 /*yield*/, this.readBundleFile(bundlePath)];
                    case 1:
                        bundleContent = _a.sent();
                        return [4 /*yield*/, this.uploadBundleAsync(endpoint, bundleContent)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PortalApi.prototype.publishFrameworkAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var endpoint;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        endpoint = this.serverHost + "/bundles/frameworks/publish";
                        return [4 /*yield*/, this.postAsync(endpoint)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PortalApi.prototype.publishAppAsync = function (appKey) {
        return __awaiter(this, void 0, void 0, function () {
            var endpoint;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        endpoint = this.serverHost + "/bundles/apps/" + appKey + "/publish";
                        return [4 /*yield*/, this.postAsync(endpoint)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PortalApi.prototype.publishTilesAsync = function (tileKey) {
        return __awaiter(this, void 0, void 0, function () {
            var endpoint;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        endpoint = this.serverHost + "/bundles/apps/" + tileKey + "/publish";
                        return [4 /*yield*/, this.postAsync(endpoint)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PortalApi.prototype.uploadBundleAsync = function (endpoint, bundleContent) {
        return __awaiter(this, void 0, void 0, function () {
            var token, options, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fusionAuth_1["default"].getAppAccessTokenAsync()];
                    case 1:
                        token = _a.sent();
                        options = {
                            method: 'POST',
                            uri: endpoint,
                            body: bundleContent,
                            headers: {
                                'content-type': 'application/zip',
                                'authorization': 'bearer ' + token
                            }
                        };
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, rp(options)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.log("error: ", error_1);
                        throw error_1;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    PortalApi.prototype.postAsync = function (endpoint) {
        return __awaiter(this, void 0, void 0, function () {
            var token, options, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fusionAuth_1["default"].getAppAccessTokenAsync()];
                    case 1:
                        token = _a.sent();
                        options = {
                            method: 'POST',
                            uri: endpoint,
                            headers: {
                                'content-type': 'application/json',
                                'authorization': 'bearer ' + token
                            }
                        };
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, rp(options)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        console.log("error: ", error_2);
                        throw error_2;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    PortalApi.prototype.readBundleFile = function (bundlePath) {
        var zipContents = fs.readFileSync(bundlePath);
        return zipContents;
    };
    return PortalApi;
}());
exports["default"] = PortalApi;
