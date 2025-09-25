const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://muvvasankar1997_db_user:3NjN4u99tv8ZcrUp@nodebackend.apdhh1j.mongodb.net/devTinder"
    );
}

module.exports = {
    connectDB
}