import Settings from "@core/settings";
import bcrypt from "bcrypt";
const settings = new Settings();

const makePassword = async (plainText: string): Promise<string> => {
    const hash = await bcrypt.hash(plainText, settings.BCRYPT_ROUND);
    return hash;
};

const verifyPassword = async (
    hash: string,
    plainText: string
): Promise<boolean> => {
    const result = await bcrypt.compare(plainText, hash);
    return result;
};

export { makePassword, verifyPassword };
