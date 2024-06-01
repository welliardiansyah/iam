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
exports.UserController = void 0;
var data_source_1 = require("../data-source");
var encrypt_1 = require("../helpers/encrypt");
var User_entity_1 = require("../entity/User.entity");
var User_Dto_1 = require("../dto/User.Dto");
var UserController = /** @class */ (function () {
    function UserController() {
    }
    UserController.registerUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, name, email, password, userRepository, getUsers, encryptedPassword, user, saveData, result, token, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, name = _a.name, email = _a.email, password = _a.password;
                        if (!email || !password || !name) {
                            return [2 /*return*/, res.status(400).json({ message: "Email and password are required" })];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 5, , 6]);
                        userRepository = data_source_1.AppDataSource.getRepository(User_entity_1.UserEntity);
                        return [4 /*yield*/, userRepository.findOne({ where: { email: email } })];
                    case 2:
                        getUsers = _b.sent();
                        if (getUsers) {
                            return [2 /*return*/, res.status(404).json({ message: "Email already exist!." })];
                        }
                        return [4 /*yield*/, encrypt_1.encrypt.encryptpass(password)];
                    case 3:
                        encryptedPassword = _b.sent();
                        user = new User_entity_1.UserEntity();
                        user.name = name;
                        user.email = email;
                        user.password = encryptedPassword;
                        return [4 /*yield*/, userRepository.save(user)];
                    case 4:
                        saveData = _b.sent();
                        delete saveData["password"];
                        result = new User_Dto_1.UserLoginDto();
                        result.name = user.name;
                        result.email = user.email;
                        token = encrypt_1.encrypt.generateToken({
                            id: user.id,
                            name: user.name,
                            email: user.email
                        });
                        return [2 /*return*/, res.status(200).json({ message: "User berhasil untuk dibuat!.", data: saveData, token: token })];
                    case 5:
                        error_1 = _b.sent();
                        console.error("Error in registering user:", error_1);
                        return [2 /*return*/, res.status(500).json({ message: "Internal server error" })];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    UserController.updateUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, _a, name, email, userRepository, user, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        id = req.params.id;
                        _a = req.body, name = _a.name, email = _a.email;
                        userRepository = data_source_1.AppDataSource.getRepository(User_entity_1.UserEntity);
                        return [4 /*yield*/, userRepository.findOne({ where: { id: id } })];
                    case 1:
                        user = _b.sent();
                        user.name = name;
                        user.email = email;
                        return [4 /*yield*/, userRepository.save(user)];
                    case 2:
                        _b.sent();
                        res.status(200).json({ message: "User Berhasil untuk diubah!.", data: user });
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _b.sent();
                        console.error("Error in registering user:", error_2);
                        return [2 /*return*/, res.status(500).json({ message: "Internal server error" })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserController.deleteUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, userRepository, user, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        id = req.params.id;
                        userRepository = data_source_1.AppDataSource.getRepository(User_entity_1.UserEntity);
                        return [4 /*yield*/, userRepository.findOne({ where: { id: id } })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            return [2 /*return*/, res.status(404).json({ message: "User not found" })];
                        }
                        return [4 /*yield*/, userRepository.softDelete(id)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, res.status(200).json({ message: "User berhasil untuk dihapus!", data: user })];
                    case 3:
                        error_3 = _a.sent();
                        console.error("Error in deleting user:", error_3);
                        return [2 /*return*/, res.status(500).json({ message: "Internal server error" })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return UserController;
}());
exports.UserController = UserController;
//# sourceMappingURL=User.Controller.js.map