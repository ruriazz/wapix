import { v4 as uuidv4 } from 'uuid';
import { mongoose } from '@core/databases';
import { type AccountRole } from './@typed';
const { Schema } = mongoose;

const accountRoleSchema = new Schema({
    uid: {
        type: String,
        unique: true,
        required: true,
        default: () => uuidv4(),
    },
    slug: { type: String, unique: true, required: true },
    name: String,
    enable: { type: Boolean, default: false },
    level: Number,
});

const AccountRoleModel: mongoose.Model<AccountRole> = mongoose.model<AccountRole>('AccountRole', accountRoleSchema, 'accountRoles');

AccountRoleModel.createIndexes();

export default AccountRoleModel;
export { accountRoleSchema, type AccountRole };
