const express = require('express');
const router = express.Router();
const appointments = require('../models/appointment');

/* GET users listing. */
router.get('/', (req, res, next) => {
    console.log("HERE");
    appointments.getToday((err, rows) => {
        if (err)
            console.log("error occured" + err);

        else {
            res.header("Content-Type", 'application/json');
            res.json(rows)
        }
    })
});

router.post('/confirm/:apptID', (req, res, next) => {
    appointments.confirm(req.params.apptID, (err, rows) => {
        if (err) {
            res.status(500);
            res.json({error: err});
        }
        res.json({success: true})
    })
});


module.exports = router;
