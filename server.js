const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.urlencoded({extended: true})); 
app.use(express.json());

mongoose.connect('mongodb://localhost/test707', { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) throw err;
  console.log('Mongoose connected!');
});
const User = mongoose.model('User', { name: String });


app.get('/', (req, res) => res.send("Hello world"));

app.post('/user', async (req, res) => {
  try {
    const user = new User({ name: req.body.username });
    await user.save();
    res.send('Success!').status(201);
  } catch (err) {
    res.send(err.message).status(500);
  }
});

app.get('/user', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send(users)
    } catch (error) {
        
    }
}); 

server = app.listen(3000, () => console.log('Example app listening on port 3000!'));

process.on('SIGINT', () => {
    console.info('SIGTERM signal received.');
    console.log('Closing http server.');
    server.close(() => {
        console.log('Http server closed.');
        mongoose.connection.close(false, () => {
            console.log(
                "MongoDb connection closed."
            )
            process.exit(0);
        });
    });
});