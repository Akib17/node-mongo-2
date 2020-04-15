const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
app.use(cors())
app.use(bodyParser.json())

const uri = process.env.DB_PATH
const client = new MongoClient(uri, { useNewUrlParser: true });

app.get('/products', (req, res) => {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("OnlineStore").collection("AmazonProducts");
        collection.find().toArray((error, documents) => {
            if (error) {
                console.log(error)
            } else {
                res.send(documents)
            }
        });
        client.close();
    });
})

app.get('/product/:key', (req, res) => {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    const key = req.params.key
    client.connect(err => {
        const collection = client.db("OnlineStore").collection("AmazonProducts");
        collection.find({key}).toArray((error, documents) => {
            if (error) {
                console.log(error)
            } else {
                res.send(documents[0])
            }
        });
        client.close();
    });
})

app.post('/productByKey', (req, res) => {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    const key = req.params.key
    const productKeys = req.body
    client.connect(err => {
        const collection = client.db("OnlineStore").collection("AmazonProducts");
        collection.find({ key: { $in: productKeys } }).toArray((error, documents) => {
            if (error) {
                console.log(error)
            } else {
                res.send(documents)
            }
        });
        client.close();
    });
})

app.post('/addProduct', (req, res) => {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    const product = req.body
    console.log(product)
    client.connect(err => {
        const collection = client.db("OnlineStore").collection("AmazonProducts");
        collection.insert(product, (error, result) => {
            if (error) {
                console.log(err)
            } else {
                res.send(result.ops[0])
                console.log('Connection successful...', result)
            }
        });
        client.close();
    });
})

app.post('/orderPlaced', (req, res) => {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    const orderDetails = req.body
    orderDetails.orderTime = new Date()
    console.log(orderDetails)
    client.connect(err => {
        const collection = client.db("OnlineStore").collection("Order");
        collection.insert(orderDetails, (error, result) => {
            if (error) {
                console.log(err)
            } else {
                res.send(result.ops[0])
                console.log('Connection successful...', result)
            }
        });
        client.close();
    });
})

// app.listen(4000, () => console.log('App is listening from 4000'))

app.set( 'port', ( process.env.PORT || 4000 ));

// Start node server
app.listen( app.get( 'port' ), function() {
  console.log( 'Node server is running on port ' + app.get( 'port' ));
  });