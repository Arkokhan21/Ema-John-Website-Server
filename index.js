const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xj7qmnz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const productsCollection = client.db('emaJohn').collection('products')

        app.get('/products', async (req, res) => {
            const page = parseInt(req.query.page)
            const size = parseInt(req.query.size)
            const query = {}
            const cursor = productsCollection.find(query)
            const products = await cursor.skip(page * size).limit(size).toArray()
            const count = await productsCollection.estimatedDocumentCount()
            res.send({ count, products })
        })


        app.post('/productsByIds', async (req, res) => {
            const ids = req.body
            const objectIds = ids.map(id => ObjectId(id))
            const query = { _id: { $in: objectIds } }
            const cursor = productsCollection.find(query)
            const products = await cursor.toArray()
            res.send(products)
        })
    }
    finally {

    }
}
run().catch(err => console.log(err))


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})