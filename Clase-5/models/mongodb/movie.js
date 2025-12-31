const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri =
    "mongodb+srv://myAtlasDBUser:<db_password>@myatlasclusteredu.uktyjpa.mongodb.net/?appName=myAtlasClusterEDU";  

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
})

async function connect() {
    try {
        await client.connect()
        const database = client.db('database')
        return database.collection('movies')
    } catch {
        console.error('Error connecting to the database')
        console.error(error)
        await client.close()
    }
}

export class MovieModel {
    static async getAll({ genre }) {
        const db = await connect()

        if (genre) {
            return db.find({
                genre: {
                    $elemMatch: {
                        $regex: genre,
                        $options: 'i'
                    }
                }
            }).toArray()
        }
        return db.find({}).toArray()
    }

    static async getById({ id }) {
        const db = await connect()
        const objectId = new ObjectId(id)
        return db.findOne({_id: objectId})
    }

    static async create({ input }) {
        const db = await connect()

        const { inserteid } = await db.insertOne(input)

        return {
            id: inserteid,
            ...input
        }
    }

    static async delete({ id }) {
        const db = await connect()
        const objectId = new ObjectId(id)
        const { deletedCount } = await db.deleteOne({ _id: objectId })
        return deletedCount > 0
    }

    static async update({ id, input }) {
        const db = await connect()
        const objectId = new ObjectId(id)
        const { ok, value } = await db.findOneAndUpdate({ _id: objectId }, { $set: input }, { returnDocument: true })
        
        if (!ok) return false
        
        return value
    }
}