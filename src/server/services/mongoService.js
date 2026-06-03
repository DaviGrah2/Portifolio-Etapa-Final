const { MongoClient } = require('mongodb')

let client
let db

async function connectMongo(uri) {
  if (db) return db
  if (!uri) {
    throw new Error('MONGODB_URI não definido.')
  }

  client = new MongoClient(uri)
  await client.connect()
  db = client.db()
  return db
}

function getCollection(name) {
  if (!db) {
    throw new Error('Banco de dados não conectado.')
  }
  return db.collection(name)
}

async function saveConversation(sessionId, message) {
  const collection = getCollection('conversations')
  await collection.insertOne({ sessionId, ...message, createdAt: new Date() })
}

async function saveContact(payload) {
  const collection = getCollection('contactMessages')
  await collection.insertOne({ ...payload, createdAt: new Date() })
}

module.exports = { connectMongo, saveConversation, saveContact }
