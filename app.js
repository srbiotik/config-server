import fs from 'fs';
import path from 'path';

import express from 'express';

import {
    Config
} from './config';

const config = Config();
config.readCofingFolder();

const app = express();
app.set('json spaces', 2);

// Watch configuration for changes
fs.watch(path.join(__dirname, 'config'), (event, fileName) => {
    console.log(fileName)
    let fileNameNoExt = path.parse(fileName).name
    config[fileNameNoExt] = parseFile(path.join(__dirname, 'config', fileName));
}, config)

app.use('/settings', (req, res, next) => {
    let cfg = config.readPath(req);
    console.log(`Sending data: \n`, cfg)
    res.status(200).json(cfg)
})

app.use('/all-settings', (req, res, next) => {
    res.status(200).json(config.data)
})

app.listen(4001, (err) => {
    if (err) {
        `Config server failed: ${err}`
    } else {
        console.log('Config server listening on port 4001.')
    }
})