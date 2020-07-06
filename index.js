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
const User = mongoose.model('User', { name: String, age: Number, address: String });
const User_logs = mongoose.model('User_logs', { userId: String, activeTime: Date })

app.get('/', (req, res) => { res.end('Hello world') })

app.post('/user', (req, res) => {
  try {
    const user = new User({ name: req.body.name, age: req.body.age, address: req.body.address });
    user.save(function(err, obj) {
      if (err) {
        res.send(err);
      } else {
        const user = obj._id
        const user_log = new User_logs({ userId: user, activeTime: new Date().getTime() })
        user_log.save(function(err, log) {
          if (err) res.send(err)
          else {
            setTimeout(() => {
              res.status(200).send(log)
            }, 1500)
          }
        })
      }

    });
  } catch (err) {
    throw err
  }
});

app.delete('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id
    console.log(userId)
    const user = await User.findByIdAndDelete(userId);
    console.log(user)
    if(user) {
      const userLog = await User_logs.findOneAndDelete({ userId: userId });
      setTimeout(() => {
        res.send({
          message: 'Delete success',
          user_log: userLog
        });
      }, 1500);
    }
  } catch (error) {
    throw error
  }
});

app.get('/user_logs', async (req, res) => {
  try {
    const users = await User_logs.find();
    res.send(users)
  } catch (error) {
    res.send(err)
  }
});

app.get('/user', async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).send(users)
    } catch (error) {
        throw error;
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