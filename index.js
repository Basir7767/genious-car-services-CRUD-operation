// It needed to use express package  
const express = require('express');
// To connect database cluster 
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// it will connect client side to server side
const cors = require('cors');

// it needed protect the .env
require('dotenv').config();

// when call express it create a app
const app = express();
// It needed to running server in browser port 5000 
const port = process.env.PORT || 5000;

// middleware
// it needed for using cors
app.use(cors());
// It needed those data we get by body we unable to parse the data without it
app.use(express.json());

// To connect database cluster 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c2mcd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('geniousCar').collection('service');
        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        // Post 
        app.post('/service', async (req, res) => {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result);
        });

        // Delete
        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        });
    }

    finally {

    }
}

run().catch(console.dir);

// it needed to check those data we are going to create it worked or not 
app.get('/', (req, res) => {
    res.send('Running Genius Server');
});

// it needed for listening that your data running on port 5000 thats why you need to go package.json inside the script object you need add two start  
// "start": "node index.js",
// "start-dev": "nodemon index.js",
app.listen(port, () => {
    console.log('Listening to port', port);
})