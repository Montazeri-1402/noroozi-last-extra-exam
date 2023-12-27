var express = require('express');
const {stringify} = require('querystring');
const {cache} = require("express/lib/application");
var router = express.Router();
const fs = require('fs').promises;

router.get('/projects', function (req, res, next) {
    getProjects("timeTracker.json").then((jsonData) => {
        if (jsonData) {
            res.send(jsonData);
        }
    })
        .catch((error) => {
            console.error('>>>>> Error in the example:', error.message);
        });
});

router.post('/add', function (req, res, next) {
    const {id, data} = req.body;
    setData(data, id, "timeTracker.json"); // Pass the address as a parameter
});

router.get('/times', function (req, res, next) {
    getTimes("timeTracker.json", req.query.id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send("Project not found");
            }
        })
        .catch((error) => {
            console.log(error.message);
            res.status(500).send("Internal Server Error");
        });
});

async function getTimes(address, id) {
    try {
        const fileContent = await fs.readFile(address, 'utf8');
        const jsonData = JSON.parse(fileContent);
        const project = jsonData.find(project => project.projectID === id);

        if (project) {
            return project.times;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error reading JSON data:', error.message);
        return null;
    }
}


async function getProjects(address) {
    try {
        const fileContent = await fs.readFile(address, 'utf8');
        const jsonData = JSON.parse(fileContent);
        console.log('JSON data read from', address);
        return jsonData;
    } catch (error) {
        console.error('Error reading JSON data:', error.message);
        return null;
    }
}

async function setData(data, id, address) {
    try {
        const dataString = JSON.stringify(data, null, 2);
        const fileContent = await fs.readFile(address, 'utf8');
        const jsonData = JSON.parse(fileContent);

        const dataChoose = jsonData.find(project => project.projectID === id);
        if (dataChoose) {
            if (dataChoose.times === []) {
                dataChoose.times = dataChoose.times || [];

                dataChoose.times = JSON.parse(dataString);
            } else {
                const dataJson = JSON.parse(dataString);
                dataChoose.times.push(dataJson);
            }
            await fs.writeFile(address, JSON.stringify(jsonData, null, 2));

            console.log('JSON data has been saved to', address);
        } else {
            console.log(`Project with projectID ${id} not found`);
        }
    } catch (error) {
        console.error('Error saving JSON data:', error.message);
    }
}


module.exports = router;
