const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();

// middleware
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const uri =
  "mongodb+srv://tanvir:tanvir1@taskbackend.f8sryar.mongodb.net/?retryWrites=true&w=majority&appName=taskbackend";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const contactCollection = client.db("contactDB").collection("contacts");

    // post single data endpoint
    app.post("/contacts", async (req, res) => {
      const contact = req.body;
      console.log("contact", contact);
      const result = await contactCollection.insertOne(contact);
      console.log(result);
      res.send(result);
    });

    app.get("/contacts", async (req, res) => {
      const result = await contactCollection.find().toArray();
      console.log(result);
      res.send(result);
    });

    // delete single user
    app.delete("/contacts/:id", async (req, res) => {
      const id = req.params.id;
      console.log("id", id);
      const query = {
        _id: new ObjectId(id),
      };
      const result = await contactCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Task is running .....");
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
