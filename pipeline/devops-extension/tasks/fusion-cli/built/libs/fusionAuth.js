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
var tl = require("azure-pipelines-task-lib/task");
var rp = require("request-promise-native");
var fs = require("fs");
var tenantId = '3aa4a235-b6e2-48d5-9195-7fcf05b459b0';
var FusionAuth = /** @class */ (function () {
    function FusionAuth() {
    }
    FusionAuth.getAppAccessTokenAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var connection, tokenResource, options, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        connection = this.getServiceConnection();
                        if (connection == null) {
                            tl.setResult(tl.TaskResult.Failed, 'Could not find any service connection');
                            throw new Error('Could not find any service endpoint');
                        }
                        tokenResource = tl.getInput('tokenResource', true);
                        if (tokenResource.toLowerCase() == 'test') {
                            tokenResource = '5a842df8-3238-415d-b168-9f16a6a6031b';
                        }
                        options = {
                            method: 'POST',
                            uri: "https://login.microsoftonline.com/" + tenantId + "/oauth2/token",
                            form: {
                                client_secret: connection.clientSecret,
                                grant_type: 'client_credentials',
                                client_id: connection.clientId,
                                resource: tokenResource
                            },
                            headers: {
                            /* 'content-type': 'application/x-www-form-urlencoded' */ // Is set automatically
                            }
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, rp(options)];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, JSON.parse(response).access_token];
                    case 3:
                        error_1 = _a.sent();
                        tl.setResult(tl.TaskResult.Failed, 'Could not get auth token.');
                        console.log("error: ", error_1);
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    FusionAuth.getServiceConnection = function () {
        var connectedService = tl.getInput("fusionAppConnection", true);
        if (!connectedService) {
            return null;
        }
        if (this.isDebug) {
            // Read test connection
            var contents = fs.readFileSync('test-credentials.json', 'utf8');
            var config = JSON.parse(contents);
            return {
                clientId: config.clientId,
                clientSecret: config.clientSecret
            };
        }
        var authScheme = tl.getEndpointAuthorizationScheme(connectedService, true);
        var clientId = tl.getEndpointAuthorizationParameter(connectedService, 'username', true);
        var password = tl.getEndpointAuthorizationParameter(connectedService, 'password', true);
        return {
            clientId: clientId,
            clientSecret: password
        };
    };
    FusionAuth.isDebug = false;
    return FusionAuth;
}());
exports["default"] = FusionAuth;
