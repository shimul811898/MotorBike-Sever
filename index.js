const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

dotenv.config();

const uri = process.env.MONGODB_URI;

const app = express();

const PORT = process.env.PORT;

app.use(cors());

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {
        await client.connect();
        const db = client.db("motobike");
        const bikecollection = db.collection("bikes");

        app.get("/bikes", async (req, res) => {
            const result = await bikecollection.find().toArray();
            res.json(result);
        })

        app.get("/bikes/:id", async (req, res) => {
            const { id } = req.params;
            const result = await bikecollection.findOne({ _id: new ObjectId(id) });
            res.json(result)
        })
        
         app.get("/bikes/:id", async (req, res) => {
            
         })



        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Server is running fine")
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})