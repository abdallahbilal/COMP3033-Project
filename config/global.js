require('dotenv').config();
const configuration = {
    connectionString:{
        MongoDB:process.env.connection_string_MongoDB
    }
};

module.exports = configuration;
