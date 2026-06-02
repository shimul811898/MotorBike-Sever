const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");

dotenv.config();
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

const bikes = [
  {
    name: "Yamaha R15 V4",
    brand: "Yamaha",
    price: 520000,
    cc: 155,
    condition: "New",
    image: "https://demo.ovatheme.com/ireca/wp-content/uploads/2018/08/aprilia-rsv4-rf.jpg",
    rating: 4.8,
  },
  {
    name: "Honda CBR 150R",
    brand: "Honda",
    price: 480000,
    cc: 150,
    condition: "Used",
    image: "https://demo.ovatheme.com/ireca/wp-content/uploads/2018/08/aprilia-rsv4-rf-new.jpg",
    rating: 4.6,
  },
  {
    name: "Suzuki GSX R150",
    brand: "Suzuki",
    price: 495000,
    cc: 150,
    condition: "New",
    image: "https://demo.ovatheme.com/ireca/wp-content/uploads/2018/08/honda-fury-chopper-2018-copy.jpg",
    rating: 4.7,
  },
  {
    name: "Bajaj Pulsar NS160",
    brand: "Bajaj",
    price: 250000,
    cc: 160,
    condition: "Used",
    image: "/assets/bikes/ns160.jpg",
    rating: 4.3,
  },
  {
    name: "TVS Apache RTR 160",
    brand: "TVS",
    price: 240000,
    cc: 160,
    condition: "New",
    image: "/assets/bikes/apache.jpg",
    rating: 4.4,
  },
  {
    name: "KTM Duke 200",
    brand: "KTM",
    price: 600000,
    cc: 200,
    condition: "New",
    image: "/assets/bikes/duke200.jpg",
    rating: 4.9,
  },
  {
    name: "Hero Xtreme 160R",
    brand: "Hero",
    price: 210000,
    cc: 160,
    condition: "Used",
    image: "/assets/bikes/xtreme160.jpg",
    rating: 4.2,
  },
  {
    name: "Royal Enfield Classic 350",
    brand: "Royal Enfield",
    price: 420000,
    cc: 350,
    condition: "Used",
    image: "/assets/bikes/classic350.jpg",
    rating: 4.5,
  },
  {
    name: "Yamaha FZS V3",
    brand: "Yamaha",
    price: 270000,
    cc: 150,
    condition: "New",
    image: "/assets/bikes/fzs.jpg",
    rating: 4.6,
  },
  {
    name: "Honda CB Hornet 160R",
    brand: "Honda",
    price: 230000,
    cc: 160,
    condition: "Used",
    image: "/assets/bikes/hornet.jpg",
    rating: 4.3,
  },
];

async function seedDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    const db = client.db("motobike");
    const bikecollection = db.collection("bikes");

    // পুরানো data মুছে ফেলো
    await bikecollection.deleteMany({});
    console.log("Old bike data cleared.");

    // নতুন data insert করো
    const result = await bikecollection.insertMany(bikes);
    console.log(`${result.insertedCount} bikes inserted successfully!`);
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await client.close();
    console.log("Connection closed.");
  }
}

seedDatabase();