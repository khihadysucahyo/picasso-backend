const fire = require('../utils/firebase')
const db = fire.firestore()

module.exports = async (req, res) => {
    const db = fire.firestore()
    const allData = []
    db.collection('users')
        .orderBy('created_at', 'desc').get()
        .then(snapshot => {
            snapshot.forEach((hasil)=>{
                allData.push(hasil.data())
            })
            res.send(allData)
        }).catch((error)=>{
        console.log(error)
    })
}
