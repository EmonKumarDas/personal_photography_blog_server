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
    const CommentCollection = client.db("photographyBlog").collection("comments");

    //   get data
    app.get('/services', async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      console.log(page, size)
      const query = {};
      const service = ServiceCollection.find(query);
      const newService = await service.skip(page * size).limit(size).toArray();
      const count = await ServiceCollection.estimatedDocumentCount();
      res.send({ count, newService });
    })


    // get data by id
    app.get('/services/:id', async (req, res) => {
      const query = {};
      const service = ServiceCollection.find(query);
      const newservice = await service.toArray();
      const findServiceById = newservice.find(getService => getService._id == req.params.id)
      res.send(findServiceById);
    })


    // send data to database
    app.post('/comments', async (req, res) => {
      const comment = req.body;
      const comments = await CommentCollection.insertOne(comment);
      res.send(comments);
    })


    // get data from database
    app.get('/comments', async(req, res) => {
      const comment = CommentCollection.find({});
      const getComments = await comment.toArray();
      res.send(getComments);
    })


  }

  finally { }
}
run().catch();



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})