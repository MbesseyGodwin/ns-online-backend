const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors'); // Import the cors package

const app = express();
const port = process.env.PORT || 5000;

const mongoURI = 'null';
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use(cors()); // Use cors middleware to enable CORS for all routes

app.post('/api/reports', async (req, res) => {
    try {
        await client.connect();
        const db = client.db('nmrs-support');
        const collection = db.collection('reports');

        const data = req.body;
        await collection.insertOne(data);

        console.log('Data inserted:', data); // Log the inserted data
        res.status(201).json({ message: 'Data inserted successfully' });
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        client.close();
    }
});

app.get('/api/reports', async (req, res) => {
    try {
        await client.connect();
        const db = client.db('nmrs-support');
        const collection = db.collection('reports');

        const reports = await collection.find({}).toArray();
        
        res.status(200).json(reports);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        client.close();
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
