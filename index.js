const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

dotenv.config();

const uri = process.env.MONGODB_URI;

const app = express();

const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');

// Fallback data — used when MongoDB is not connected
const fallbackBikes = [
  { _id: new ObjectId(), name: "Yamaha R15 V4", brand: "Yamaha", price: 520000, cc: 155, condition: "New", image: "https://demo.ovatheme.com/ireca/wp-content/uploads/2018/08/aprilia-rsv4-rf.jpg", rating: 4.8 },
  { _id: new ObjectId(), name: "Honda CBR 150R", brand: "Honda", price: 480000, cc: 150, condition: "Used", image: "https://demo.ovatheme.com/ireca/wp-content/uploads/2018/08/aprilia-rsv4-rf-new.jpg", rating: 4.6 },
  { _id: new ObjectId(), name: "Suzuki GSX R150", brand: "Suzuki", price: 495000, cc: 150, condition: "New", image: "https://demo.ovatheme.com/ireca/wp-content/uploads/2018/08/honda-fury-chopper-2018-copy.jpg", rating: 4.7 },
  { _id: new ObjectId(), name: "Bajaj Pulsar NS160", brand: "Bajaj", price: 250000, cc: 160, condition: "Used", image: "https://demo.ovatheme.com/ireca/wp-content/uploads/2018/08/aprilia-rsv4-rf.jpg", rating: 4.3 },
  { _id: new ObjectId(), name: "TVS Apache RTR 160", brand: "TVS", price: 240000, cc: 160, condition: "New", image: "https://demo.ovatheme.com/ireca/wp-content/uploads/2018/08/honda-fury-chopper-2018-copy.jpg", rating: 4.4 },
  { _id: new ObjectId(), name: "KTM Duke 200", brand: "KTM", price: 600000, cc: 200, condition: "New", image: "https://demo.ovatheme.com/ireca/wp-content/uploads/2018/08/aprilia-rsv4-rf-new.jpg", rating: 4.9 },
  { _id: new ObjectId(), name: "Hero Xtreme 160R", brand: "Hero", price: 210000, cc: 160, condition: "Used", image: "https://demo.ovatheme.com/ireca/wp-content/uploads/2018/08/aprilia-rsv4-rf.jpg", rating: 4.2 },
  { _id: new ObjectId(), name: "Royal Enfield Classic 350", brand: "Royal Enfield", price: 420000, cc: 350, condition: "Used", image: "https://demo.ovatheme.com/ireca/wp-content/uploads/2018/08/honda-fury-chopper-2018-copy.jpg", rating: 4.5 },
  { _id: new ObjectId(), name: "Yamaha FZS V3", brand: "Yamaha", price: 270000, cc: 150, condition: "New", image: "https://demo.ovatheme.com/ireca/wp-content/uploads/2018/08/aprilia-rsv4-rf-new.jpg", rating: 4.6 },
  { _id: new ObjectId(), name: "Honda CB Hornet 160R", brand: "Honda", price: 230000, cc: 160, condition: "Used", image: "https://demo.ovatheme.com/ireca/wp-content/uploads/2018/08/aprilia-rsv4-rf.jpg", rating: 4.3 },
];
let fallbackOrders = [];
let dbConnected = false;

let db;
let bikecollection;
let odercollection;

async function run() {
    try {
        await client.connect();
        db = client.db("motobike");
        bikecollection = db.collection("bikes");
        odercollection = db.collection("oders");
        await client.db("admin").command({ ping: 1 });
        dbConnected = true;
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.error("MongoDB connection failed, using in-memory fallback data.");
        dbConnected = false;
    }
}
run().catch(console.dir);

// Routes
app.get("/bikes", async (req, res) => {
    try {
        if (dbConnected && bikecollection) {
            const result = await bikecollection.find().toArray();
            return res.json(result);
        }
        res.json(fallbackBikes);
    } catch (error) {
        res.json(fallbackBikes);
    }
});

app.get("/bikes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (dbConnected && bikecollection && ObjectId.isValid(id)) {
            const result = await bikecollection.findOne({ _id: new ObjectId(id) });
            if (result) return res.json(result);
        }
        const bike = fallbackBikes.find(b => b._id.toString() === id);
        if (bike) return res.json(bike);
        res.status(404).json({ error: "Bike not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/oders", async (req, res) => {
    try {
        const order = req.body;
        if (dbConnected && odercollection) {
            const result = await odercollection.insertOne(order);
            return res.json(result);
        }
        order._id = new ObjectId();
        fallbackOrders.push(order);
        res.json({ acknowledged: true, insertedId: order._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/oders/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (dbConnected && odercollection && ObjectId.isValid(id)) {
            const result = await odercollection.findOne({ _id: new ObjectId(id) });
            if (result) return res.json(result);
        }
        const order = fallbackOrders.find(o => o._id.toString() === id);
        if (order) return res.json(order);
        res.status(404).json({ error: "Order not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/oders", async (req, res) => {
    try {
        if (dbConnected && odercollection) {
            const result = await odercollection.find().toArray();
            return res.json(result);
        }
        res.json(fallbackOrders);
    } catch (error) {
        res.json(fallbackOrders);
    }
});

app.put("/oders/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedOrder = req.body;
        delete updatedOrder._id;
        if (dbConnected && odercollection && ObjectId.isValid(id)) {
            const result = await odercollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updatedOrder }
            );
            return res.json(result);
        }
        const idx = fallbackOrders.findIndex(o => o._id.toString() === id);
        if (idx !== -1) {
            fallbackOrders[idx] = { ...fallbackOrders[idx], ...updatedOrder };
            return res.json({ acknowledged: true, modifiedCount: 1 });
        }
        res.json({ acknowledged: true, modifiedCount: 0 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete("/oders/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (dbConnected && odercollection && ObjectId.isValid(id)) {
            const result = await odercollection.deleteOne({ _id: new ObjectId(id) });
            return res.json(result);
        }
        const len = fallbackOrders.length;
        fallbackOrders = fallbackOrders.filter(o => o._id.toString() !== id);
        res.json({ acknowledged: true, deletedCount: len - fallbackOrders.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.send("Server is running fine")
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})