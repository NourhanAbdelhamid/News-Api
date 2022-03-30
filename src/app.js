const express = require('express')
require('dotenv').config()

const app = express()
const port = process.env.PORT 

require('./db/mongoose')
app.use(express.json())


const reporter = require('./routers/reporters')
const newsRouter =require('./routers/news')
app.use(reporter)
app.use(newsRouter)

app.listen(port,()=>{console.log('Server is running ' + port)})