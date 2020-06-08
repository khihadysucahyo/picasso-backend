const fire = require('../utils/firebase')
const db = fire.firestore()

module.exports = async (req, res) => {
    db.settings({
        timestampsInSnapshots: true
    })
    db.collection('logbook').add({
        nama: req.body.nama,
        usia: req.body.usia,
        kota: req.body.kota,
        createdAt: new Date()
    })
    res.send({
        nama: req.body.nama,
        usia: req.body.usia,
        kota: req.body.kota,
        createdAt: new Date()
    })
}
