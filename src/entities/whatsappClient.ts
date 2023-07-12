import { v4 as uuidv4 } from 'uuid';
import { mongoose } from '@core/databases';
import { WhatsappClient } from './@typed';
import { whatsappClientStatus } from '@const';
const { Schema } = mongoose;

const whatsappClientSchema = new Schema({
    uid: {
        type: String,
        unique: true,
        required: true,
        default: () => uuidv4(),
    },
    name: String,
    number: { type: String, unique: true, required: true },
    status: { type: String, default: whatsappClientStatus.UNAUTHORIZED },
    authCollection: String,
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() },
    authenticatedAt: Date,
});

const WhatsappClientModel: mongoose.Model<WhatsappClient> = mongoose.model<WhatsappClient>('WhatsappClient', whatsappClientSchema, 'whatsappClients');

WhatsappClientModel.createIndexes();

export default WhatsappClientModel;
export { whatsappClientSchema, WhatsappClient };
