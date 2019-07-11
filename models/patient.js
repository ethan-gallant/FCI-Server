var db = require('../db.js')

exports.get = (id,done) => {
    db.get().query(`SELECT
    PatNum,
    FName,
    LName,
    Address,
    Address2,
    City,
    state,
    HmPhone,
    WkPhone,
    WirelessPhone,
    Email,
    ImageFolder,
    PreferConfirmMethod,
    PreferContactMethod,
    PreferRecallMethod
     FROM patient where patnum = ?`,[id], function (err, rows) {
        if (err) return done(err)
        done(null, rows)
    })
};

exports.addFile = (patnum,filename,done)=>{
    db.get().query(`INSERT INTO document(
        Description, 
        DateCreated, 
        DocCategory, 
        PatNum, 
        FileName, 
        ImgType, 
        IsFlipped, 
        DegreesRotated, 
        SigIsTopaz, 
        CropX, 
        CropY, 
        CropW, 
        CropH, 
        WindowingMin, 
        WindowingMax, 
        MountItemNum, 
        ExternalSource,
        RawBase64,
        Thumbnail,
        ExternalGUID) 
        VALUES ('Kiosk Profile Picture', CURRENT_TIMESTAMP(), '203', ?, ?, '2', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'None','','','');`,[patnum,filename],function (err,rows) {
        if(err)
            done(err,null);
        done(null,rows)
    });
}

exports.updateData = (patnum,data,done)=>{
    const validKeys = [ 'PreferConfirmMethod', 'PreferContactMethod', 'PreferRecallMethod','WirelessPhone','WkPhone','HmPhone','Email'];

    let valuesArray = [];

    let sqlString = "UPDATE patient SET ";

    Object.keys(data).forEach((key) => validKeys.includes(key) || delete data[key]);

    Object.keys(data).forEach((key) => {
        sqlString += `${key} = ?, `;
        valuesArray.push(data[key]);
    });

    valuesArray.push(patnum);

    sqlString += "WHERE patnum = ?";
    const lastCommaIndex = sqlString.lastIndexOf(',');
    const finalsqlstr = sqlString.slice(0,lastCommaIndex) + sqlString.slice(lastCommaIndex+1);


    db.get().query(finalsqlstr, valuesArray, function (err, rows) {
        if(err){
            done(err,null);
        }
        done(null,rows);
    })
};
//
exports.getLatestImage = (patnum, done) => {
    db.get().query('SELECT * FROM document where PatNum = ? and DocCategory = 203 and ImgType = 2 ORDER BY DocNum DESC', [patnum], (err,rows)=>{
        if(err)
            done(err,null);
        done(null,rows)
    })
}