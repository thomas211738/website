import {MongoClient} from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const mongoDBURL = process.env.mongoDBURL;

(async () => {
    const client = new MongoClient(mongoDBURL);

    try {
        await client.connect();

        const sourceDB = client.db('test');
        const targetDB = client.db('Website');

        const sourceCollection = sourceDB.collection('websitepics-collection');
        const targetCollection = targetDB.collection('websitePics2');

        // Fetch all documents from the source collection
        const documents = await sourceCollection.find({}).toArray();

        // Insert documents into the target collection
        if (documents.length > 0) {
            await targetCollection.insertMany(documents);
        }

        console.log('Collection copied successfully!');
    } catch (error) {
        console.error('Error copying collection:', error);
    } finally {
        await client.close();
    }
})();
