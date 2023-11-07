const { format } = require('date-fns')
const { v4: uuid } = require('uuid')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

/**
 * Logs an event and sotres it in a file
 * @param message: The message to be logged 
 * @param logFileName The name of the file to store the log
 */
const logEvents = async(message, logFileName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`

    try {
        // If the logs folder can't be found. create it
        if (!fs.existsSync(path.join(__dirname,'..', 'logs' ))) {
            await fsPromises.mkdir();
        }

        // Append the log to the log file
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem)
    }
    catch (err) {
        console.log(err)
    }
}

// Listen for log events
// TODO: This needs logic to prevent excessive logging
const logger = (req, res, next) => {
    //logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
    console.log(`${req.method} ${req.path}`)

    // Move on to the next piece of middleware
    next()
}

module.exports = { logEvents, logger }