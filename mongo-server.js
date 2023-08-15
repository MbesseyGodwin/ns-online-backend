const express = require("express");
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// Import the MongoDB URI from a separate file
const mongoURI = require('./app/config/config.js').mongoURI;

// Set up the MongoDB connection and collection
let reportsCollection;
let client; // Define client globally

async function connectToDatabase() {
    try {
        client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const db = client.db('nmrs-support');
        reportsCollection = db.collection('reports');
        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}

// GET route to retrieve names from the reports collection
app.get('/api/names', async (req, res) => {
    try {
        if (!reportsCollection) {
            return res.status(500).json({ message: 'Database connection not ready' });
        }

        const names = await reportsCollection.find({}).project({ _id: 0, name: 1 }).toArray();
        
        res.status(200).json(names);
    } catch (error) {
        console.error('Error fetching names:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Start the server
async function startServer() {
    await connectToDatabase();
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

startServer();
