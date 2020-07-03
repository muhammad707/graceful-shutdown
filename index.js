const express = require('express');
const mongoose = require('mongoose');
const app = express()
const port = process.env.port || 8000
app.use(express.urlencoded({extended: true})); 
app.use(express.json());
let counter = 0;
app.use((req, res, next) => {
  counter++;
  console.log("Req", counter, new Date().getTime().toString())
  res.on('finish', () => {
    counter = counter - 1;
      console.log("Res", counter, new Date().getTime().toString());
  })
  next()
})

mongoose.connect('mongodb://localhost/test707', { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) throw err;
  console.log('Mongoose connected!');
});
const User = mongoose.model('User', { name: String });

app.get('/', (req, res) => { res.end('Hello world') })

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
        setTimeout(() => {
          res.status(200).send(users)
        }, 5000);
    } catch (error) {
        
    }
}); 

const server = require('http').createServer(app)
server.listen(port, () => {
  console.log('Express server listening on port ' + server.address().port)
})
process.on('SIGINT', () => {
  console.info('SIGINT signal received.')

  // Stops the server from accepting new connections and finishes existing connections.
  server.close(function(err) {
    // if error, log and exit with error (1 code)
    if (err) {
      console.error(err)
      process.exit(1)
    }

    // close your database connection and exit with success (0 code)
    // for example with mongoose
    mongoose.connection.close(function () {
      console.log('Mongoose connection disconnected')
      process.exit(0)
    })
  })
})