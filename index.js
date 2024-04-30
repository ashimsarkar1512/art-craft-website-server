const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app=express()
const port=process.env.PORT || 5000;



app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ljh6ijp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
    // await client.connect();
    

    const artCraftCollection=client.db('artCraftDB').collection('artCraft')

    const artCraftCategory=client.db('artCraftDB').collection('artCategory')


    app.get('/addCraft',async(req,res)=>{
      const cursor=artCraftCollection.find();
      const result=await cursor.toArray();
      res.send(result);
    })

    app.post('/addCraft',async(req,res)=>{
      const addCraft=req.body
      console.log(addCraft);
      const result=await artCraftCollection.insertOne(addCraft)
      res.send(result)
    })

    app.get('/addCraft/:email', async(req,res)=>{
      console.log(req.params.email);
      const result=await artCraftCollection.find({email:req.params.email}).toArray();
      res.send(result)
    })

   app.get('/artCategory',async(req,res)=>{
     
    const cursor=artCraftCategory.find()
    const result=await cursor.toArray()
    res.send(result)

   })

    app.get('/addCrafts/:id',async(req,res)=>{
      const id =req.params.id;
      const query={_id: new ObjectId(id)}
      const result=await artCraftCollection.findOne(query)
      res.send(result)
    })

    app.put('/addCrafts/:id',async(req,res)=>{
      const id=req.params.id;
      const filter={_id: new ObjectId(id)}
      const options={upsert:true}
      const updateCraft=req.body;
      const artCraft={
        $set:{
          item:updateCraft.item,
          subcategory:updateCraft.subcategory,
          price:updateCraft.price,
          rating:updateCraft.rating,
          customization:updateCraft.customization,
          time:updateCraft.time,
          status:updateCraft.status,
          image:updateCraft.image,
          shortDes:updateCraft.shortDes,
          name:updateCraft.name,
          email:updateCraft.email,
        }
      }

      const result=await artCraftCollection.updateOne(filter,artCraft,options)
      res.send(result)
    })

    app.delete('/addCraft/:id',async(req,res)=>{
      const id=req.params.id
      const query={_id: new ObjectId(id)}
      const result=await artCraftCollection.deleteOne(query)
      res.send(result)
    })


   


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
//     await client.close();
  }
}
run().catch(console.dir);




app.get('/',(req,res)=>{
res.send('craft server is running')
})

app.listen(port,()=>{
            console.log(`craft server is running on port ${port}`);
})