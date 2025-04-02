import { Collection, MongoClient } from 'mongodb'

const MONGO_URI = 'mongodb://127.0.0.1:27017'
const client = new MongoClient(MONGO_URI)
export async function getCollectionByDatabase(
  database: string,
  collection: string
): Promise<Collection<Document>> {
  const db = client.db(database)
  return db.collection(collection)
}

export async function closeClient() {
  await client.close()
}
