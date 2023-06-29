import { mongoose } from '@core/databases';
import { type AuthSession } from './@typed';
const { Schema } = mongoose;

const authSessionSchema = new Schema({
    account: { type: Schema.Types.ObjectId, required: true, ref: 'Account' },
    attempt: Number,
    lastAttempt: { type: Date, required: true, default: () => new Date() },
    authorizedAt: { type: Date, required: false },
    authToken: { type: String, required: false },
    refreshToken: { type: String, required: false },
});

const AuthSessionModel: mongoose.Model<AuthSession> = mongoose.model<AuthSession>('AuthSession', authSessionSchema, 'authSessions');

AuthSessionModel.createIndexes();

export default AuthSessionModel;
export { authSessionSchema, type AuthSession };
