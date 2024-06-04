import * as express from "express";
import { UserController } from "../controllers/User.Controller";
import { AuthController } from "../controllers/Auth.Controller";
import { authentification } from "../middleware/auth.middleware";
import { FaController } from "../controllers/FaController";
import { BiometircController } from "../controllers/Biometric.Controller";
const Router = express.Router();

//** AUTH ROUTES */
Router.post("/auth/register", UserController.registerUser);
Router.post("/auth/login", AuthController.login);
Router.get("/auth/profile", authentification, AuthController.getProfile);
Router.put("/auth/update/:id", authentification, UserController.updateUser);
Router.delete("/auth/update/:id", UserController.deleteUser);
Router.post("/auth/logout", AuthController.logout);

//** FA REGISTER */
Router.post("/fa/register", FaController.faRegister);
Router.post("/fa/verify", FaController.validate);

//** BIOMETRIC REGISTER */
Router.post("/biometric/register", BiometircController.biometricRegister);
Router.post("/biometric/login", BiometircController.biometricLogin);

export { Router as Routes };