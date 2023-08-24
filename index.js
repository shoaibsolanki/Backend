
const connectToMongo = require('./db');
const express = require('express')


var cors = require('cors')

connectToMongo();
const app = express()

const port = 5000

app.use(cors())
app.use(express.json())

//available routes
app.use("/uploads",express.static('uploads'))
app.use('/api/auth', require('./routers/auth'))
app.use('/api/book', require('./routers/book'))
app.use('/api/test', require('./routers/Tests'))
app.use('/api/Transaction', require('./routers/Transaction'))
app.use('/api', require('./routers/GetRecipte'))
app.use('/api', require('./routers/Notifiation'))

app.listen(port, () => {
  console.log(`Mad-Pharma backend listening at on //localhost:${port}`)
})
