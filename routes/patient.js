const express = require('express');
const router = express.Router();
const patients = require('../models/patient');
const fs = require('fs');
const config = require("../config.js");
const log = require("../tools").log;


/* GET users listing. */
router.get('/', (req, res, next) => {
    res.send('not implemented');
});

router.get('/:patientID',  (req, res, next) => {
    patients.get(req.params.patientID, (err, rows) => {
        if (err) {
            res.status(500);
            res.json({error: err});
        }
        res.json(rows[0])
    })
});

router.put('/:patientID',  (req, res, next) => {
    patients.updateData(req.params.patientID, req.body, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.json({error: err});
        }
        res.json({"data": data})
    })
});

router.post('/:patientID/photo', (req, res, next) => {
    patients.get(req.params.patientID, (err, rows) => {
        const patient = rows[0];
        const foldername = patient.ImageFolder;
        const filename = Date.now() + ".png";
        patients.addFile(patient.PatNum, filename, (err, rows) => {
            if (err) {
                res.status(500);
                res.json({error: err});
                console.log("Add patient file in DB error:" + err);

            }
        });
        try {
            const b64image = req.body.photo.replace(/^data:([A-Za-z-+/]+);base64,/, '');
            fs.writeFile(config.get("share-location") + `${patient.LName.toUpperCase().charAt(0)}\\${foldername}\\${filename}`, b64image, {encoding: 'base64'}, function (err) {
                if (err) {
                    res.status(500);
                    res.json({error: err});
                    console.log("Write file error:" + err);

                }
                console.log("The file was saved!");
                res.json({"success": true})
            });
        } catch (e) {
            res.status(500);
            console.log(e);
            res.json({error: "Failed to save to the selected share location :("})
        }

    });

});

router.get('/:patientID/photo', (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');

    patients.get(req.params.patientID, (err, rows) => {

        const patient = rows[0];
        const foldername = patient.ImageFolder;
        patients.getLatestImage(patient.PatNum, (err, data) => {
            if (data[0]) {
                const filename = `${patient.LName.toUpperCase().charAt(0)}\\\\${foldername}\\\\${data[0].FileName}`;
                log("fetching filename of " + filename);
                res.sendFile(config.get("share-location") + filename);

            } else {
                res.status(404);
                log("No patient photo found for req.params.patientID");
                res.json({error: err});
            }

        });
        /**/
    });
});

module.exports = router;
