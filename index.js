require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;

// use middleware
app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hrhwfvt.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        const menuCollection = client.db('Bistro-Boss_DB').collection('menu');
        const reviewsCollection = client.db('Bistro-Boss_DB').collection('review');
        const cartsCollection = client.db('Bistro-Boss_DB').collection('carts');

        // getting all menu
        app.get('/menu', async(req, res) => {
            const result = await menuCollection.find().toArray();
            res.send(result)
        })
        // getting all reviews
        app.get('/reviews', async(req, res) =>{
            const result = await reviewsCollection.find().toArray();
            res.send(result)
        })
        // post all carts to the carts collection
        app.post('/carts', async(req, res) => {
            const cartItem = req.body
            const result = await cartsCollection.insertOne(cartItem)
            res.send(result)
        })
        // create API to getting all carts
        app.get('/carts', async(req, res) => {
            const email = req.query.email
            const query = {userEmail: email}
            const result =  await cartsCollection.find(query).toArray();
            res.send(result)
        })


        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Bistro-boss_server is running')
})

app.listen(port, () => {
    console.log('listening to the port ' + port);
})
