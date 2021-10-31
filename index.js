const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;



const app = express()
const port = process.env.PORT || 5000;


//middleware

app.use(cors());
app.use(express.json());

// MongoDb 


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gfhug.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect();
        const database = client.db('travel_tevily');
        const serviceCollection = database.collection('service');
        const orderCollection = database.collection('order');
        const myOrderCollection = database.collection('myOrder');
		
		
		// There will be All API 

    //Service POST API
    app.post('/services', async(req, res) => {
      const service =  req.body;
      console.log('hit the service', service);
      const result = await serviceCollection.insertOne(service);
      console.log(result);
      res.json(result)
    });

    // Orders POST API
    app.post('/orders', async(req, res) => {
      const order =  req.body;
      console.log('hit the service', order);
      const result = await orderCollection.insertOne(order);
      console.log(result);
      res.json(result)
    });

    // GET API 

     //Service GET/READ API 
      
     app.get('/services', async(req, res) => {
      const cursor = serviceCollection.find({});
      const services = await cursor.toArray();
      res.send(services); 
    });

    // Orders GET API 

    app.get('/orders', async(req, res) => {
      const cursor = orderCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders); 
    });

    // myOrders GET API
    app.get('/myOrders', async(req, res) => {
      const cursor = myOrderCollection.find({});
      const myOrders = await cursor.toArray();
      res.send(myOrders); 
    });

  

    // GET Single API 

      //Service GET Single Item API
      app.get('/services/:id', async(req, res)=> {
        const id = req.params.id;
        console.log('getting specific service', id);
        const query = {_id: ObjectId(id)}
        const services = await serviceCollection.findOne(query);
        res.json(services);
      })


    //Orders DELETE API  

    app.delete('/orders/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await orderCollection.deleteOne(query);
      console.log('deleted user id', result);
      res.json(result);
    });

    // myOrder DELETE API 

    app.delete('/deleteOrder/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await myOrderCollection.deleteOne(query);
      console.log('deleted user id', result);
      res.json(result);
    });
		
	}
    finally{
      //await client.close();
    }
}
run().catch(console.dir)



app.get('/', (req, res) => {
  res.send('Running My CRUD Server')
})

app.listen(port, () => {
  console.log(`Running Server at http://localhost:${port}`)
})