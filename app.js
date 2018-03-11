require('dotenv').config();

const express  = require('express');
const multer   = require('multer');
const upload   = multer({dest: 'uploads'});
const app      = express();

const method   = require('./method');
const compare  = require('./compare');
const appPort  = parseInt(process.env.PETAK_PORT);

app.get('/', (req, res) => {
    res.send("It's on. Send POST request to /send_image to use");
});

app.post('/send_image', upload.single('screenshot'), (req, res) => {
    res.json(method.createImage(req.file, req.body.label, req.body.test));
});

app.listen(appPort, () => console.log('Example app listening on port ' + appPort));