const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const cluster = require('cluster');
const os = require('os');
const busboy = require('connect-busboy');

const indexRoutes = require('./routes/index');


require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const numCPUs = os.cpus().length;

if (cluster.isMaster) {
    // Fork workers for each CPU
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    
    cluster.on('exit', (worker) => {
        console.error(`Worker ${worker.id} crashed. Starting a new worker...`);
        cluster.fork();
    });
} else {
    // Configure Winston logger
    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        transports: [
            new winston.transports.Console({
                format: winston.format.simple()
            }),
            new DailyRotateFile({
                filename: 'logs/application-%DATE%.log',
                datePattern: 'YYYY-MM-DD-HH',
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '14d'
            })
        ]
    });
    
    // Middlewares
    app.use(helmet());
    app.use(cors()); // Handle CORS for all routes
    app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })); // 100 requests per 15 minutes
    app.use(busboy()); // Using connect-busboy middleware
    app.use(bodyParser.json());
    
    // Routes
    app.get('/', (req, res) => {
        res.send('Hello, world!');
    });
    
    // Health Check Endpoint
    app.get('/health', (req, res) => res.status(200).send('OK'));

    app.use('/api', indexRoutes);

    // Error handling middleware
    app.use((err, req, res, next) => {
        logger.error(err.stack);
        res.status(500).send('Something went wrong!');
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
        logger.info('SIGTERM signal received. Shutting down gracefully.');
        server.close(() => {
            logger.info('Server closed.');
        });
    });

    const server = app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT} with pid ${process.pid}`);
    });

    module.exports = app; // for testing purposes
}
