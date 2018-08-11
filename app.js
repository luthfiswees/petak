require('dotenv').config();

const express  = require('express');
const multer   = require('multer');
const upload   = multer({dest: 'uploads'});
const app      = express();

const method   = require('functions/method');
const compare  = require('functions/compare');
const appPort  = parseInt(process.env.PETAK_PORT);

app.get('/', (req, res) => {
    res.send("It's on. Send POST request to /send_image to use");
});

app.post('/send_image', upload.single('screenshot'), async (req, res) => {
    const image = await method.createImage(req.file, req.body.label, req.body.test);
    console.log(image);
    res.json(image);
});

app.get('/tests', async (req, res) => {
    const data = await method.getAllTest();
    res.json(data);
});

app.get('/labels', async (req, res) => {
    const data = await method.getAllLabelOnTest(req.query.testname);
    res.json(data);
});

app.get('/images', async (req, res) => {
    const data = await method.getAllImageOnLabel(req.query.labelname);
    res.json(data);
});

app.delete('/label', async (req, res) => {
    const data = await method.deleteLabel(req.query.labelname);
    res.json(data);
});

app.delete('/test', async (req, res) => {
    const data = await method.deleteTest(req.query.testname);
    res.json(data);
});

app.listen(appPort, () => console.log('Example app listening on port ' + appPort));