"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
var express = require("express");
var User_Controller_1 = require("../controllers/User.Controller");
var Auth_Controller_1 = require("../controllers/Auth.Controller");
var auth_middleware_1 = require("../middleware/auth.middleware");
var FaController_1 = require("../controllers/FaController");
var Router = express.Router();
exports.Routes = Router;
//** AUTH ROUTES */
Router.post("/auth/register", User_Controller_1.UserController.registerUser);
Router.post("/auth/login", Auth_Controller_1.AuthController.login);
Router.get("/auth/profile", auth_middleware_1.authentification, Auth_Controller_1.AuthController.getProfile);
Router.put("/auth/update/:id", auth_middleware_1.authentification, User_Controller_1.UserController.updateUser);
Router.delete("/auth/update/:id", User_Controller_1.UserController.deleteUser);
//** FA REGISTER */
Router.post("/fa/register", FaController_1.FaController.faRegister);
Router.post("/fa/verify", FaController_1.FaController.validate);
//# sourceMappingURL=Routes.js.map