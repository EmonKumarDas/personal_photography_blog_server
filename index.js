const express = require('express');
const app = express();
const cors = require('cors');
const port = 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

require('dotenv').config();

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.send("Hell");
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ljdbc6c.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    const ServiceCollection = client.db("photographyBlog").collection("service");

    //   get data
    app.get('/services', async (req, res) => {
      const query = {};
      const service = ServiceCollection.find(query);
      const newservice = await service.toArray();
      res.send(newservice);
    })

  }

  finally { }
}
run().catch();



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})