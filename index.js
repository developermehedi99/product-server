const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());


// Mongo DB part
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f6qd7af.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();

    // server working start
    const productCollection = client.db('productDB').collection('product');

    app.get('/product', async(req, res)=>{
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    // update er jonno 
    app.get('/product/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await productCollection.findOne(query);
      res.send(result);
    })

    app.post('/product', async(req, res)=>{
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct)
      res.send(result)
    })

    app.put('/product/:id', async(req, res)=>{
      const updateProduct = req.body;
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const product = {
        $set:{
          name:updateProduct.name,
          chef:updateProduct.chef,
          supplier:updateProduct.supplier,
          taste:updateProduct.taste,
          category:updateProduct.category,
          details:updateProduct.details,
          photo:updateProduct.photo,
        }
      }
      const result = await productCollection.updateOne(filter,product,options);
      res.send(result)
    })

    app.delete('/product/:id', async(req, res)=>{
      const id = req.params.id;
      const query ={_id: new ObjectId(id)}
      const result = await productCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('the server is running on port:5000')
})

app.listen(port, ()=>{
    console.log(`the server is running on port: ${port}`)
})