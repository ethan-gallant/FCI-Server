var db = require('../db.js')

exports.getToday = (done) => {
    db.get().query(`SELECT 
    aptnum,
    appointment_tbl.patnum,
    aptstatus,
    confirmed,
    op,
    AptDateTime,
    DateTimeArrived,
    DateTimeSeated,
    patient_tbl.FName,
    patient_tbl.LName
    FROM appointment appointment_tbl 
    INNER JOIN patient patient_tbl on appointment_tbl.patnum = patient_tbl.patnum 
    where DATE(AptDateTime) = CURDATE();`, (err, rows) => {
        if (err) return done(err);
        done(null, rows)
    })
};

exports.getPatient = (id, done) => {
    db.get().query(`SELECT
    patient_tbl.Address,
    patient_tbl.Address2,
    patient_tbl.City,
    patient_tbl.state,
    patient_tbl.HmPhone,
    patient_tbl.WkPhone,
    patient_tbl.WirelessPhone,
    patient_tbl.Email
     FROM appointment where aptnum = ?`, [id], (err, rows) => {
        if (err) return done(err);
        done(null, rows)
    })
};

exports.confirm = (aptnum, done) => {
    db.get().query('UPDATE appointment SET DateTimeArrived = CURRENT_TIMESTAMP(), Confirmed = 266 where aptnum = ?', [aptnum], (err, rows) => {
        if (err) return done(err);
        done(null, rows)
    })
};

