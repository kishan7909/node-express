require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload')

const app = express();

app.use(cors())

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(fileUpload());

// Endpointsapp.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
fs.readdirSync('./routes').map((file) => {
    app.use('/api', require('./routes/' + file))
})

module.exports = app;
