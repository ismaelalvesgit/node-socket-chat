//@Author ismael alves
import express from 'express'
import bodyParser from 'body-parser'

//instancia
const app = express();

//middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

//assets
app.use(express.static('./public'))

export default app;