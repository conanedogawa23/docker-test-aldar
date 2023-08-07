const mongoose = require('mongoose');

class DatabaseService {
    constructor() {
        if (!DatabaseService.instance) {
            this._connection = null;
            DatabaseService.instance = this;
        }
        
        return DatabaseService.instance;
    }

    async connect(uri) {
        if (!this._connection) {
            try {
                const options = {
                    poolSize: 10,  // Maintain up to 10 socket connections
                    useUnifiedTopology: true,
                    useNewUrlParser: true,
                    useCreateIndex: true,
                    // If not connected, return errors immediately rather than waiting for reconnect
                    bufferCommands: false,
                    // Enable sharding - Important: You need to have a MongoDB cluster that supports sharding.
                    autoIndex: false,  // Don't build indexes
                    retryWrites: true,
                    w: 'majority',
                    family: 4  // Use IPv4, skip trying IPv6
                };

                await mongoose.connect(uri, options);
                this._connection = mongoose.connection;

                this._connection.on('error', (err) => {
                    console.error(`MongoDB Connection Error: ${err}`);
                    this._connection = null;  // Reset the connection if there's an error
                });

            } catch (error) {
                console.error(`Unable to connect to MongoDB: ${error}`);
            }
        }
        return this._connection;
    }

    async disconnect() {
        if (this._connection) {
            await mongoose.disconnect();
            this._connection = null;
        }
    }

    getConnection() {
        return this._connection;
    }

    async resetConnection(uri) {
        // Disconnect the current connection
        await this.disconnect();
        // Connect again
        return this.connect(uri);
    }
}

const instance = new DatabaseService();
Object.freeze(instance);  // Ensure instance immutability

module.exports = instance;
