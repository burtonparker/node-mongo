const MongoClient = require('mongodb').MongoClient;
const dboper = require('./operations');

const url = 'mongodb://localhost:27017/';
const dbname = 'nucampsite';

// teaching note: we are nesting a TON of callbacks here, and that's not something we necessarily want to do in best practice. more to come on this subject later.

MongoClient.connect(url, { useUnifiedTopology: true }).then(client => { // later versions of node driver won't require true, the true flag is suggested by the dev team.

    console.log('Connected correctly to server');

    const db = client.db(dbname); // this method connects us to the nucampsite database

    // note: "dropping" in db world is not for the faint of heart, tread carefully...

    db.dropCollection('campsites')
    .then(result => {
        console.log('Dropped Collection', result);
    })
    .catch(err => console.log('No collection to drop.'));

    dboper.insertDocument(db, {name: "Breadcrumb Trail Campground", description: "Test"}, 'campsites') 
    .then(result => { // defining a function here but NOT calling it, important programming concept with callbacks
        console.log('Insert Document:', result.ops); // short for operations. also check commit history because we deleted some important shit below here.

            return dboper.findDocuments(db, 'campsites');
    })
    .then(docs => {
        console.log('Found Documents:', docs);

        return dboper.updateDocument(db, { name: "Breadcrumb Trail Campground" }, 
            { description: "Updated Test Description"}, 'campsites'); // here we are looking for a name that matches Breadcrumb Trail Campground then updating it's description - only works for Breadcrumb...
    })
    .then(result => {
        console.log('Updated Document Count:', result.result.nModified);

        return dboper.findDocuments(db, 'campsites') 
    })
    .then(docs => {
        console.log('Found Documents:', docs);

        return dboper.removeDocument(db, { name: "Breadcrumb Trail Campground" },
            'campsites');
    })
    .then(result => {
            console.log('Deleted Document Count:', result.deletedCount);

            return client.close();
    })
    .catch(err => {
        console.log(err);
        client.close();
    });
})
.catch(err => console.log(err));