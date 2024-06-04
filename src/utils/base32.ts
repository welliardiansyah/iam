import { encode as hiBase32 } from 'hi-base32';

const crypto = require("crypto");

export class Base32 {
    static async generateBase32Secret() {
        try {
            const buffer = crypto.randomBytes(15);
            const base32 = hiBase32(buffer).replace(/=/g, "").substring(0, 24);
            return base32;
        } catch (error) {
            return error;
        }
    }
}
