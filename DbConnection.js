const mongoose = require('mongoose');

class DbConnection {

    constructor() {
        if (this.constructor === DbConnection) {
            throw (`Cant't instantiate`)
        }
    }

    static async setConnection(connectionString) {
        if(this.connected || this.connecting)
            return;
        mongoose.connection.on('error', () => {
            console.error('Could not connect to MongoDB');
        });

        mongoose.connection.on(mongoose.STATES[0], () => {
            console.error('Connection to MongoDB closed');
        });
        mongoose.connection.on(mongoose.STATES[1], () => {
            this.isConnectedBefore = true;
            console.info('Connection established to MongoDB');
        });

        mongoose.connection.on('reconnected', () => {
            console.info('Reconnected to MongoDB');
        });

        mongoose.connection.on(mongoose.STATES[2], () => {
            console.info('Connecting to MongoDB');
        });
        
        mongoose.set('debug', true);
        
        process.on('exit', mongoose.connection.close);
        process.on('SIGINT', mongoose.connection.close);
        process.on('SIGTERM', mongoose.connection.close);
        process.on('uncaughtException', mongoose.connection.close);

        this.connecting = true;
        await mongoose.connect(connectionString, {
            auto_reconnect: true,
             useNewUrlParser: true,
              useUnifiedTopology: true,
              useCreateIndex: true,
              useFindAndModify: false
            });
        this.connected = true;
    }
}

module.exports = DbConnection;


