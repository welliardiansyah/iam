import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { UserEntity } from "../entity/User.entity";
import { encrypt } from "../helpers/encrypt";
import { Base32 } from '../utils/base32';

const crypto = require("crypto");
const OTPAuth = require("otpauth");
const hiBase32 = require("hi-base32");
const QRCode = require('qrcode');

const userRepository = AppDataSource.getRepository(UserEntity);

export class FaController {
    static async faRegister(req: Request, res: Response) {
        try {
            const { email } = req.body;
            const user = await userRepository.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({
                    code: 401,
                    status: 'fail',
                    message: "Users cannot be found!."
                });
            }

            const base32_secret = await Base32.generateBase32Secret();
            user.secret = base32_secret;

            let totp = new OTPAuth.TOTP({
                issuer: "localhost",
                label: email,
                algorithm: "SHA1",
                digits: 6,
                period: 30,
                secret: OTPAuth.Secret.fromBase32(base32_secret),
            });
            const otpauth_url = totp.toString();

            QRCode.toDataURL(otpauth_url, (err, url) => {
                if (err) {
                    return res.status(500).json({
                        code: 401,
                        status: 'fail',
                        message: "Error while generating QR Code"
                    });
                }
                userRepository.save(user);
                res.status(200).json({
                    message: "Secret generated successfully.",
                    secret: base32_secret,
                    qrcode: url
                });
            });
        } catch (error) {
            return res.status(500).json({
                status: 'fail',
                message: "Error while generating QR Code",
                error
            });
        }
    }

    static async validate(req: Request, res: Response) {
        try {
            const { token } = req.body;
            
            const users = await userRepository.find();
            if (!users.length) {
                return res.status(401).json({
                    status: 'fail',
                    message: "No users found."
                });
            }

            let user;
            for (const u of users) {
                const totp = new OTPAuth.TOTP({
                    issuer: "localhost",
                    label: u.email,
                    algorithm: "SHA1",
                    digits: 6,
                    period: 30,
                    secret: OTPAuth.Secret.fromBase32(u.secret!),
                });
                const delta = totp.validate({ token });

                if (delta !== null) {
                    user = u;
                    break;
                }
            }

            if (!user) {
                return res.status(401).json({
                    status: 'fail',
                    message: "Authentication failed"
                });
            }

            const tokens = encrypt.generateToken({
                id: user.id,
                name: user.name,
                email: user.email
            });

            if (!user.enable2fa) {
                user.enable2fa = true;
                await userRepository.save(user);
            }

            res.json({
                status: "success",
                otp_valid: true,
                user,
                tokens
            });
        } catch (error) {
            return res.status(500).json({
                status: 'fail',
                message: "Error while validating token",
                error
            });
        }
    }
}
