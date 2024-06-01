"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaController = void 0;
var data_source_1 = require("../data-source");
var User_entity_1 = require("../entity/User.entity");
var encrypt_1 = require("../helpers/encrypt");
var crypto = require("crypto");
var OTPAuth = require("otpauth");
var hiBase32 = require("hi-base32");
var QRCode = require('qrcode');
var userRepository = data_source_1.AppDataSource.getRepository(User_entity_1.UserEntity);
var FaController = /** @class */ (function () {
    function FaController() {
    }
    FaController.faRegister = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var email, user_1, base32_secret_1, totp, otpauth_url, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        email = req.body.email;
                        return [4 /*yield*/, userRepository.findOne({ where: { email: email } })];
                    case 1:
                        user_1 = _a.sent();
                        if (!user_1) {
                            return [2 /*return*/, res.status(401).json({
                                    code: 401,
                                    status: 'fail',
                                    message: "Users cannot be found!."
                                })];
                        }
                        base32_secret_1 = generateBase32Secret();
                        user_1.secret = base32_secret_1;
                        totp = new OTPAuth.TOTP({
                            issuer: "localhost",
                            label: email,
                            algorithm: "SHA1",
                            digits: 6,
                            period: 30,
                            secret: OTPAuth.Secret.fromBase32(base32_secret_1),
                        });
                        otpauth_url = totp.toString();
                        QRCode.toDataURL(otpauth_url, function (err, url) {
                            if (err) {
                                return res.status(500).json({
                                    code: 401,
                                    status: 'fail',
                                    message: "Error while generating QR Code"
                                });
                            }
                            userRepository.save(user_1);
                            res.status(200).json({
                                message: "Secret generated successfully.",
                                secret: base32_secret_1,
                                qrcode: url
                            });
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        return [2 /*return*/, res.status(500).json({
                                status: 'fail',
                                message: "Error while generating QR Code",
                                error: error_1
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FaController.validate = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var token, users, user, _i, users_1, u, totp, delta, tokens, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        token = req.body.token;
                        return [4 /*yield*/, userRepository.find()];
                    case 1:
                        users = _a.sent();
                        if (!users.length) {
                            return [2 /*return*/, res.status(401).json({
                                    status: 'fail',
                                    message: "No users found."
                                })];
                        }
                        user = void 0;
                        for (_i = 0, users_1 = users; _i < users_1.length; _i++) {
                            u = users_1[_i];
                            totp = new OTPAuth.TOTP({
                                issuer: "localhost",
                                label: u.email,
                                algorithm: "SHA1",
                                digits: 6,
                                period: 30,
                                secret: OTPAuth.Secret.fromBase32(u.secret),
                            });
                            delta = totp.validate({ token: token });
                            if (delta !== null) {
                                user = u;
                                break;
                            }
                        }
                        if (!user) {
                            return [2 /*return*/, res.status(401).json({
                                    status: 'fail',
                                    message: "Authentication failed"
                                })];
                        }
                        tokens = encrypt_1.encrypt.generateToken({
                            id: user.id,
                            name: user.name,
                            email: user.email
                        });
                        if (!!user.enable2fa) return [3 /*break*/, 3];
                        user.enable2fa = true;
                        return [4 /*yield*/, userRepository.save(user)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        res.json({
                            status: "success",
                            otp_valid: true,
                            user: user,
                            tokens: tokens
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        return [2 /*return*/, res.status(500).json({
                                status: 'fail',
                                message: "Error while validating token",
                                error: error_2
                            })];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return FaController;
}());
exports.FaController = FaController;
var generateBase32Secret = function () {
    try {
        var buffer = crypto.randomBytes(15);
        var base32 = hiBase32.encode(buffer).replace(/=/g, "").substring(0, 24);
        return base32;
    }
    catch (error) {
        return error;
    }
};
//# sourceMappingURL=FaController.js.map