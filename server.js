var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
var path = require('path');
var mongoose = require('mongoose');
// --------------------------------------------------------
mongoose.connect('mongodb://localhost/game_of_thrones');
var UserSchema = new mongoose.Schema({
 name: String,
 trait: String
},{timestamps: true}
);
mongoose.model('User', UserSchema);
// We are setting this Schema in our Models as 'User'
var User = mongoose.model('User');


// -----------------------------------------------------------
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.get('/', function(req, res) {
  User.find({}, function(err, users) {

      res.render('index',{users:users});
   // Retrieve 1 object
   // This code will run when the DB is done attempting to retrieve 1 record.
  })
})

app.post('/users', function(req, res) {
  console.log("POST DATA", req.body);
  // create a new User with the name and age corresponding to those from req.body
  var user = new User({name: req.body.name, trait: req.body.trait});
  // Try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
  user.save(function(err) {
    // if there is an error console.log that something went wrong!
    if(err) {
      console.log('something went wrong');
    }
    else { // else console.log that we did well and then redirect to the root route
      console.log('successfully added a user!');
      res.redirect('/');
      }
    })
  })

app.get('/game_of_thrones/:id',function(req,res){
  User.find({_id:req.params.id},function(err,users){
    res.render('information')
  });
});

app.post('/game_of_thrones/:id/edit',function(req,res){
  User.findOne({_id:req.params.id}, function(err, users){
  res.render('edit_record',{users:users});
  });
});

app.post('/update/:id',function(req,res){
  console.log(req.body)
  User.update({id:req.body.id}, {name: req.body.name, trait: req.body.trait}, function(err){
      // if there is an error console.log that something went wrong!
      if(err) {
        console.log('something went wrong');
      }
      else { // else console.log that we did well and then redirect to the root route
        console.log('successfully added a user!');
        res.redirect('/');
    }
  })
})

app.post('/game_of_thrones/:id/delete',function(req,res){
  console.log("POST DATA", req.body);
  User.remove({_id:req.params.id}, function(err){
  res.redirect('/');
  });
});

app.listen(8000, function() {
    console.log("listening on port 8000");
})
