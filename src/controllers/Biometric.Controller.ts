import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { UserEntity } from "../entity/User.entity";
import { encrypt } from "../helpers/encrypt";

export class BiometircController {
    static async biometricRegister(req: Request, res: Response) {
        const { id, biometric, enableBiometric } = req.body;
        if (!id || !biometric ) {
            return res.status(400).json({ message: "ID and Biometric harus di isi!." });
        }
        try {
            const userRepository = AppDataSource.getRepository(UserEntity);

            const user = await userRepository.findOne({ where: { id } });
            if (!user) {
                return res.status(404).json({ message: "Users cannot be found!." });
            }

            user.id = id;
            user.biometric = biometric;
            user.enableBiometric = enableBiometric;
            const saveData = await userRepository.save(user);

            return res.status(200).json({ message: "User biometric berhasil untuk dibuat!.", data: saveData });
        } catch (error) {
            console.error("Error in registering biometric user:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async biometricLogin(req: Request, res: Response) {
        const { biometric } = req.body;
        if (!biometric ) {
            return res.status(400).json({ message: "Biometric data are required" });
        }
        try {
            const userRepository = AppDataSource.getRepository(UserEntity);

            const user = await userRepository.findOne({ where: { biometric } });
            const token = encrypt.generateToken({
                id: user.id,
                name: user.name,
                email: user.email
            });
            if (!user) {
                return res.status(404).json({ message: "User not found or biometric data does not match" });
            }
            return res.status(200).json({ message: "Biometric login successful", data: user, token });
        } catch (error) {
            console.error("Error in biometric login:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}