var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://localhost:27017/myproject';

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  db.createCollection('students', function(err, res){
    if(err) throw err;
    console.log('Create')
     db.close();
  })
});