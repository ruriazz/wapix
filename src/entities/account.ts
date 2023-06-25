import { v4 as uuidv4 } from "uuid";
import { mongoose } from "@core/databases";
import { accountRoleSchema } from "./accountRole";
import { Account } from "./_types";
const { Schema } = mongoose;


const accountSchema = new Schema({
    uid: { type: String, unique: true, required: true, default: () => uuidv4() },
    name: String,
    email: { type: String, unique: true, required: true },
    role: accountRoleSchema,
    password: String,
    enable: { type: Boolean, default: false },
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: Date,
    verifiedAt: Date,
});

const AccountModel: mongoose.Model<Account> = mongoose.model<Account>("Account", accountSchema, "accounts");

AccountModel.createIndexes();

export default AccountModel;
export { accountSchema, Account };
