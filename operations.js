const assert = require('assert').strict;

// below is analogous to CRUD

exports.insertDocument = (db, document, collection) => {
    const coll = db.collection(collection);
    return coll.insertOne(document); // returns a promise, if we don't supply a callback the default behavior returns a promise which significantly allows us to clean up our code and avoid callback hell.
};

exports.findDocuments = (db, collection) => {
    const coll = db.collection(collection);
    return coll.find().toArray();
};

exports.removeDocument = (db, document, collection) => {
    const coll = db.collection(collection);
    return coll.deleteOne(document);
};

exports.updateDocument = (db, document, update, collection) => {
    const coll = db.collection(collection);
    return coll.updateOne(document, { $set: update }, null); // $set: update operator tells us we want to overwrite
};