const MongoClient = require('mongodb').MongoClient;
const assert = require('assert').strict;
const dboper = require('./operations');

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

        // no longer used thanks to dboper: const collection = db.collection('campsites');

        dboper.insertDocument(db, {name: "Breadcrumb Trail Campground", description: "Test"},
            'campsites', result => { // defining a function here but NOT calling it, important programming concept with callbacks
            console.log('Insert Document:', result.ops); // short for operations. also check commit history because we deleted some important shit below here.

            dboper.findDocuments(db, 'campsites', docs => {
                console.log('Found Documents:', docs);

                dboper.updateDocument(db, { name: "Breadcrumb Trail Campground" }, 
                    { description: "Updated Test Description"}, 'campsites', // here we are looking for a name that matches Breadcrumb Trail Campground then updating it's description - only works for Breadcrumb...
                    result => {
                        console.log('Updated Document Count:', result.result.nModified);

                        dboper.findDocuments(db, 'campsites', docs => {
                            console.log('Found Documents:', docs);

                            dboper.removeDocument(db, { name: "Breadcrumb Trail Campground" },
                                'campsites', result => {
                                    console.log('Deleted Document Count:', result.deletedCount);

                                    client.close();
                                }
                            );
                        });
                    }
                );
            });
        });
    });
});