/**
 * @file(connect.js) 
 * @author Shakshi Pandey <shakshi.kumari@limitlessmobile.com>
 * @version 1.0.0
 * @lastModifed 11-Jan-2018
 * @lastModifedBy Shakshi
 */
import Mongoose from 'mongoose';
import logger from '../core/logger/app.logger'
import config from '../core/config/config.dev'

/**
 * [@Promise : native promises add to mongoose promise variable]
 * @type {[object]}
 */
Mongoose.Promise = global.Promise;

/**
 * @description [Connect with mongodb with host and port]
 * @return {[object]}
 */
const connectToDb = async () => {
    let dbHost = config.dbHost;
    let dbPort = config.dbPort;
    let dbName = config.dbName;
    try {
        await Mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}`, { useMongoClient: true });
        logger.info('Connected to mongo!!!');
    }
    catch (err) {
        logger.error('Could not connect to MongoDB');
    }
}

export default connectToDb;