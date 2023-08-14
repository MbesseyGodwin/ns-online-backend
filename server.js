const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Import the MongoDB URI from a separate file
const mongoURI = require('./app/config/config.js').mongoURI;

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());

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

// Define CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// API Routes
app.get("/", (req, res) => {
  res.json({
    message: `API Routes`,
    links: [
      "/fingerprints",
      "/globalproperties",
      "/viralloads",
      "/htsresults",
      "/htsdata",
      "/drugrefill",
      "/htslist",
      "/viralloadlist",
      "/api/reports"
    ]
  });
});

// Import and use API routes
const apiRoutes = [
  "customer",
  "fingerprint",
  "globalproperty",
  "htsresult",
  "htsdata",
  "drugrefill",
  "htslist",
  "viralloadlist"
];

apiRoutes.forEach(route => {
  require(`./app/routes/${route}.routes.js`)(app);
});

// POST route for reports
app.post('/api/reports', async (req, res) => {
    try {
        if (!reportsCollection) {
            return res.status(500).json({ message: 'Database connection not ready' });
        }

        const newData = req.body;

        const filter = { name: newData.name };
        const update = { $set: newData };

        const result = await reportsCollection.updateOne(filter, update, { upsert: true });

        if (result.matchedCount > 0 || result.upsertedCount > 0) {
            console.log("Data updated successfully in the online database");
            res.status(201).json({ message: 'Data updated successfully' });
        } else {
            console.log("No matching document found. Inserting as new data.");
            await reportsCollection.insertOne(newData);
            res.status(201).json({ message: 'New data inserted successfully' });
        }
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET route for reports
app.get('/api/reports', async (req, res) => {
    try {
        if (!reportsCollection) {
            return res.status(500).json({ message: 'Database connection not ready' });
        }

        const reports = await reportsCollection.find({}).toArray();
        
        res.status(200).json(reports);
    } catch (error) {
        console.error('Error fetching data:', error);
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
