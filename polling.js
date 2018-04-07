const TelegramBot = require('node-telegram-bot-api');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
// Connection URL
const url = 'mongodb://localhost:27017';

// replace the value below with the Telegram token you receive from @BotFather
const secretToken = require('./secretToken');

const token = secretToken;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
/*bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your message');
  console.log(msg);
});*/

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const name = msg.from.first_name ? msg.from.first_name : msg.from.username;
  bot.sendMessage(chatId, `Hello, ${name}!`);
  console.log('start', msg);
})

bot.onText(/\/location (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];

  bot.sendMessage(chatId, `Your location is ${resp}`);
  saveLocation(msg.from.id, resp)
})

bot.onText(/\/info/, (msg) => {
  const chatId = msg.chat.id;
  const location =
  bot.sendMessage(chatId, `Hello, ${name}!`);
  console.log('start', msg);
})

const readLocation = async (userId) => {
  let result = '';

  const client = await MongoClient.connect(url);
  const db = client.db("wind-for-kite");
  const collection = db.collection('users');
  const userData = await collection.find({_id: userId});

  if (userData) {
    result = userData.location;
  }

  return result;
}

const saveLocation = (userId, location) => {
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db("wind-for-kite");

    const collection = db.collection('users');
    collection.updateOne({ _id : userId }
      , { $set: { location : location } }, { upsert: true }, function(err, result) {
        assert.equal(err, null);
        console.log("User location added to DB");
        //callback(result);
      });
  });
}



// Use connect method to connect to the server
/*MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db("wind-for-kite");

  findDocuments(db, () => {

    removeDocument(db, () => {

      findDocuments(db, () => {
        client.close();
      });

    });

  })
  //insertDocuments(db, function() {
  //  //console.log(result);
  //
  //  findDocuments(db, () => {
  //    client.close();
  //  })
  //});
});*/

const insertDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}

const findDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  });
}

const findDocumentsQueryFilter = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Find some documents
  collection.find({'a': 3}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs);
    callback(docs);
  });
}

const updateDocument = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Update document where a is 2, set b equal to 1
  collection.updateOne({ a : 2 }
    , { $set: { b : 1 } }, function(err, result) {
      assert.equal(err, null);
      assert.equal(1, result.result.n);
      console.log("Updated the document with the field a equal to 2");
      callback(result);
    });
}

const removeDocument = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Delete document where a is 3
  collection.deleteOne({ a : 3 }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Removed the document with the field a equal to 3");
    callback(result);
  });
}

const indexCollection = function(db, callback) {
  db.collection('documents').createIndex(
    { "a": 1 },
    null,
    function(err, results) {
      console.log(results);
      callback();
    }
  );
};