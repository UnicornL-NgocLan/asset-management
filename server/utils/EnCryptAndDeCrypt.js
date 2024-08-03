import crypto from "crypto";


export const encrypt = (text) => {
    const secretKey = Buffer.from(process.env.CRYPTO_KEY, 'utf-8');
    const cipher = crypto.createCipher("aes-256-cbc", secretKey);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
}

export function decrypt(encrypted) {
    const secretKey = Buffer.from(process.env.CRYPTO_KEY, 'utf-8');
    const decipher = crypto.createDecipher("aes-256-cbc", secretKey);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}

