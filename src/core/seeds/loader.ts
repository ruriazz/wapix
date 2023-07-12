import fs from 'fs';
import { mongoose } from '@core/databases';
import { makePassword } from '@helpers/hash';
import { staticSettings } from '@const';

const loadSeeds = async () => {
    getAllSeeds('src/core/seeds/').forEach((seed) => {
        switch (seed.type) {
            case 'once':
                const collection = mongoose.connection.collection(seed.collection);

                seed.data.forEach(async (item: Record<string, any>) => {
                    item = await serializeRecord(item);
                    const existing = await collection.findOne({
                        [seed.uniqueField]: item[seed.uniqueField],
                    });

                    if (existing == null) {
                        await collection.insertOne(item).then((ins) => {
                            console.log(ins);
                        });
                    }
                });
                break;
            default:
                break;
        }
    });
};

const serializeRecord = async (data: Record<string, any>): Promise<Record<string, any>> => {
    const result: Record<string, any> = {};
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            let value = data[key];

            if (typeof value === 'object' && data !== null) {
                value = await serializeRecord(value);
            } else if (key === '_id') {
                value = new mongoose.Types.ObjectId(value);
            } else if (typeof value == 'string' && value.startsWith('pwd__')) {
                value = await makePassword(value.replace('pwd__', ''), staticSettings.PASSWORD_BCRYPTY_ROUND);
            } else if (typeof value == 'string' && value.startsWith('ts__')) {
                value = new Date(value.replace('ts__', ''));
            }

            result[key] = value;
        }
    }

    return result;
};

const getAllSeeds = (folderPath: string): Array<Record<string, any>> => {
    const seedFiles: Array<Record<string, any>> = [];
    const fileNames = fs.readdirSync(folderPath);
    fileNames.forEach((fileName) => {
        const filePath = `${folderPath}/${fileName}`;
        if (fs.statSync(filePath).isFile()) {
            if (fileName.endsWith('.json')) {
                const jsonData = fs.readFileSync(filePath, 'utf-8');
                seedFiles.push(JSON.parse(jsonData));
            }
        }
    });

    return seedFiles;
};

export default loadSeeds;
