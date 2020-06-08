const fire = require('../utils/firebase')
const db = fire.firestore()

module.exports = async (req, res) => {
    db.settings({
        timestampsInSnapshots: true
    })
    const allData = []
    db.collection('logbook')
        .orderBy('createdAt', 'desc').get()
        .then(snapshot => {
            snapshot.forEach((hasil)=>{
                allData.push(hasil.data())
            })
            console.log(allData)
            res.send(allData)
        }).catch((error)=>{
        console.log(error)
    })
}
