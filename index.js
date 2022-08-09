
const express = require("express")
const app = express()
const cors =require('cors')
const port = process.env.PORT || 1997
const bodyParser=require('body-parser')
const {router : routerWorker }  = require('./controller/app')



app.use(cors())
app.use(bodyParser.json({
    extended:true,
    limit: '5mb'
}))
app.use(bodyParser.urlencoded({
    extended:true,
    limit: '5mb'
}))
app.use(express.static('static'))
app.use('worker', routerWorker )
app.listen(port, function(){
    console.log('server berjalan di '+ port)
})