const MongoClient = require('mongodb').MongoClient;
const assert = require('assert').strict;

const url = 'mongodb://localhost:27017/';
const dbname = 'nucampsite';

// teaching note: we are nesting a TON of callbacks here, and that's not something we necessarily want to do in best practice. more to come on this subject later.

MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => { // later versions of node driver won't require true, the true flag is suggested by the dev team.

    assert.strictEqual(err, null); // the first argument here is the actual value that we're checking, the second argument is the expected value that we're checking against to see if the first argument strictly equals the second. if the actual AND expected values match, then we'll continue on. however, if they don't match, (if err is not strictly equal to null) then this assert will fail. when an assert fails, it will throw an error and terminate the ENTIRE application and console logs the error that occured. if the assert DOES NOT fail, then everything is fine and the application continues...

    console.log('Connected correctly to server');

    const db = client.db(dbname); // this method connects us to the nucampsite database

    // note: "dropping" in db world is not for the faint of heart, tread carefully...

    db.dropCollection('campsites', (err, result) => { // name of the collection is the first argument, second argument is our good old callbacks
        assert.strictEqual(err, null);
        console.log('Dropped Collection', result);

        const collection = db.collection('campsites');

        collection.insertOne({name: "Breadcrumb Trail Campground", description: "Test"},
        (err, result) => {
            assert.strictEqual(err, null);
            console.log('Insert Document:', result.ops); // short for operations

            collection.find().toArray((err, docs) => { // leaving find() empty will find ALL the documents, there are ways to refine this by supplying a filtering condition as an argument... toArray converts the documents into an array of objects. cool!
                assert.strictEqual(err, null);
                console.log('Found Documents:', docs);

                client.close(); // closes the client's connection to the db server
            });
        });
    });
});