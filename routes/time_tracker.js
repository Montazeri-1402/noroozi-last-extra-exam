var express = require('express');
const { stringify } = require('querystring');
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
    setData(req.body, "timeTracker.json", req.params.id);
});



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



async function setData(data, filePath , id) {
    try {
        const newString = JSON.stringify(data, null, 2);

        const fileContent = await fs.readFile(address, 'utf8');

        const jsonData = JSON.parse(fileContent);

        const dataChoose = jsonData.find(project => project.projectID === id);

        dataChoose.times = {...project.times, ...newString};

        await fs.appendFile(filePath, dataChoose, 'utf8');

        console.log('JSON data has been saved to', filePath);
    } catch (error) {
        console.error('Error saving JSON data:', error.message);
    }
}

module.exports = router;