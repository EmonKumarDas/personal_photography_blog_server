const express = require('express');
const app = express();
const cors = require('cors');
const port = 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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


    // get comment by id
    app.get('/comments/:id', async (req, res) => {
      const comment = CommentCollection.find({});
      const comments = await comment.toArray();
      const findComment = comments.filter(newcomment => newcomment.cateId === req.params.id);
      res.send(findComment);

    })

    // get data by email
    app.get('/comments', async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        }
      }
      const comment = CommentCollection.find(query);
      const getComments = await comment.toArray();
      res.send(getComments);
    })

    // get data for add service
    app.post('/ServiceCollection', async (req, res) => {
      const addservices = req.body;
      const addservice = await ServiceCollection.insertOne(addservices);
      res.send(addservice);
    })

    // delete comment 
    app.delete('/commentsDelete/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const result = await CommentCollection.deleteOne(query);
      res.send(result)
    })

        // get comment by _id for editing
        app.get('/editcomment/:id', async (req, res) => {
          const comment = CommentCollection.find({});
          const comments = await comment.toArray();
          const findComment = comments.find(newcomment => newcomment._id == req.params.id);
          res.send(findComment);
    
        })

    // Edit Comments

    app.put('/commentsEdit/:id',async(req,res)=>{
      const id = req.params.id;
      const filter = {_id:ObjectId(id)}
      const comments = req.body;
      const option = {upset:true}
      const updateComments = {
          $set:{ 
            NewMessage: comments.NewMessage
          }
      }
      const result = await CommentCollection.updateOne(filter,updateComments,option)
      res.send(result)
  })

  }

  finally { }
}
run().catch();



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})