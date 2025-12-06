const express=require('express');
const app=express();
require('dotenv').config();
const db=require('./db');
const bodyParser=require('body-parser');
app.use(bodyParser.json());
db();
const cors = require('cors');
app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));
const port=process.env.PORT;

//Import from routers
const userRouters=require('./routes/userRoutes');
const habitRouter=require('./routes/habitsRoutes');

app.use('/user',userRouters);
app.use('/habit',habitRouter);

app.listen(port,()=>{
    console.log(`The server is running on http://localhost:${port}`);
});