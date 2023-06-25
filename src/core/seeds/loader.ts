import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { mongoose } from "@core/databases";
import Settings from "@core/settings";

const loadSeeds = async () => {
    const settings = new Settings();
    getAllSeeds("src/core/seeds/").forEach((seed) => {
        if (seed.auto) {
            const collection = mongoose.connection.collection(seed.collection);

            seed.data.forEach(async (item: Record<string, any>) => {
                item.uid = uuidv4();
                const existing = await collection.findOne({
                    [seed.uniqueField]: item[seed.uniqueField],
                });

                if (existing == null) {
                    await collection.insertOne(item).then((ins) => {
                        console.log(ins);
                    });
                } else if (settings.NODE_ENV == "development") {
                    delete item.uid;
                    await collection.updateOne(
                        { [seed.uniqueField]: item[seed.uniqueField] },
                        { $set: item }
                    );
                }
            });
        }
    });
};

const getAllSeeds = (folderPath: string): Record<string, any>[] => {
    const seedFiles: Record<string, any>[] = [];
    const fileNames = fs.readdirSync(folderPath);
    fileNames.forEach((fileName) => {
        const filePath = `${folderPath}/${fileName}`;
        if (fs.statSync(filePath).isFile()) {
            if (fileName.endsWith(".json")) {
                const jsonData = fs.readFileSync(filePath, "utf-8");
                seedFiles.push(JSON.parse(jsonData));
            }
        }
    });

    return seedFiles;
};

export default loadSeeds;
