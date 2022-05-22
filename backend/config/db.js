const mongoose = require('mongoose');
const {DB} = require('./index');


const databaseConnection = async() => {
    await mongoose.connect(DB)
    .then(() => {
        console.log('Connected To Database Successfully !');
    })
    .catch((err) => {
        console.log('**** Data Base Connection Error ****', err);
    })
}
module.exports = databaseConnection;

