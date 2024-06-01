import * as express from "express";
import { UserController } from "../controllers/User.Controller";
import { AuthController } from "../controllers/Auth.Controller";
import { authentification } from "../middleware/auth.middleware";
import { FaController } from "../controllers/FaController";
const Router = express.Router();

//** AUTH ROUTES */
Router.post("/auth/register", UserController.registerUser);
Router.post("/auth/login", AuthController.login);
Router.get("/auth/profile", authentification, AuthController.getProfile);
Router.put("/auth/update/:id", authentification, UserController.updateUser);
Router.delete("/auth/update/:id", UserController.deleteUser);

//** FA REGISTER */
Router.post("/fa/register", FaController.faRegister);
Router.post("/fa/verify", FaController.validate);

export { Router as Routes };