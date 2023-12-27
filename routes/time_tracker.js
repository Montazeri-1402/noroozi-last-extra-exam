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
    const { id, data } = req.body;
    setData(data, id, "timeTracker.json"); // Pass the address as a parameter
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

async function setData(data, id, address) {
    try {
        const dataJson = JSON.stringify(data, null, 2);
        const fileContent = await fs.readFile(address, 'utf8');
        const jsonData = JSON.parse(fileContent);

        const dataChoose = jsonData.find(project => project.projectID === id);
        if (dataChoose) {
            // Check if 'times' is defined in dataChoose, and if not, initialize it as an empty object
            dataChoose.times = dataChoose.times || {};
            console.log(dataChoose);
            // Update 'times' with the new data
            dataChoose.times = { ...dataChoose.times, ...dataJson };

            // Write back the entire jsonData
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
