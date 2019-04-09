import fs from 'fs';
import path from 'path';

function Config() {
    var cfg = {
        data: {},
        readCofingFolder() {
            // Initial read of config direcotry
            try {
                fs.readdir('./config', (err, files) => {
                    if (err) throw err;
                    for (let file of files) {
                        console.log('Parsing config file ', file);
                        let configName = path.parse(file).name;
                        let filePath = path.join(__dirname, 'config', file);
                        cfg.parseConfigFile(filePath)
                            .then(cfgFile => {
                                cfg.data[configName] = cfgFile
                                console.log(`${path.parse(filePath).name} config updated. With: ${cfg.data[configName]}`);
                            }).catch(err => {
                                console.log(`${path.parse(filePath).name} config parsing failed: ${err}`)
                            })
                    }
                })
            } catch (err) {
                console.log(err);
            }
        },
        parseConfigFile: (filePath) => {
            console.log(`Updating ${path.parse(filePath).name} config...`);
            return new Promise((resolve, reject) => {
                fs.readFile(filePath, "utf-8", (err, data) => {
                    let cfgFile = JSON.parse(data);
                    resolve(cfgFile)
                })
            })
        },
        readPath: (req) => {
            let path = req.query.path;
            let precise = req.query.precise;
            const pathArray = path.split(',');
            let settings;
            if (precise) {
                settings = cfg.getPrecisePath(pathArray)
            } else {
                settings = cfg.getEachPath(pathArray)
            }
            return settings
        },
        getPrecisePath: (pathArray) => {
            settings = cfg.data[pathArray.shift()];
            for (let depth of pathArray) {
                settings = settings[depth];
            }
            return settings
        },
        getEachPath: (pathArray) => {
            let settings = {}
            for (let depth of pathArray) {
                settings[depth] = cfg.data[depth];
            }
            return settings
        }

    }
    return cfg
}

export {
    Config
}