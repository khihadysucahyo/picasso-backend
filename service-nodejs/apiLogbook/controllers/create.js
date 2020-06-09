const fire = require('../utils/firebase')
const db = fire.firestore()

module.exports = async (req, res) => {
    const db = req.firebase.firestore()
    db.settings({
        timestampsInSnapshots: true
    })
    db.collection('users').add({
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
