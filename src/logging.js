/**
 * Created by michael on 2/20/17.
 */

const winston = require('winston');
const path = require('path');
// import config from "config";

module.exports = (logging_path, logging_level, log_name, audit) => {
    "use strict";
    const logger = {};

    /* Really annoying change to Winston.  Does JSON Timestamp by default
   Had to custom format the message
 */
    const logfmt = winston.format.printf((info) => {
        return `${info.timestamp} ${info.level}: ${info.message}`;
    });

    /* Create the logger and apply formatting */
    logger.applog = winston.createLogger({
        level: logging_level,
        format: winston.format.combine(
            winston.format.timestamp({
                format: "YYYY-MM-DD-HH:mm:ss"
            }),
            logfmt
        ),
        transports: [
            new winston.transports.File({
                filename: path.join(logging_path, log_name)
            })
        ]
    });

    /* Add the Unhandled Exception Handling */
    logger.applog.exceptions.handle(
        new winston.transports.File({ filename: path.join(logging_path, "jwt_uh.log")})
    );

    /* Lets log to console in dev environment shall we */
    if (process.env.NODE_ENV === "development") {
        logger.applog.add(new winston.transports.Console({
            format: winston.format.simple()
        }));
    }

    /* Create the audit logger and apply formatting */
    logger.auditlog = winston.createLogger({
        level: logging_level,
        format: winston.format.combine(
            winston.format.timestamp({
                format: "YYYY-MM-DD-HH:mm:ss"
            }),
            logfmt
        ),
        transports: [
            new winston.transports.File({
                filename: path.join(logging_path, audit.auditLog)
            })
        ]
    });

    /* Lets log to console in dev environment shall we */
    if (process.env.NODE_ENV === "development") {
        logger.auditlog.add(new winston.transports.Console({
            format: winston.format.simple()
        }));
    }

    /*
    winston.loggers.add('uhlog', {
        file: {
            filename: path.join(logging_path, 'jwt_uh.log'),
            handleExceptions: true,
            humanReadableUnhandledException: true,
            json: false
        }});

    winston.loggers.add('applog', {
        file: {
            level: logging_level,
            filename: path.join(logging_path, log_name),
            json: false,
            stderrLevels: ['error'],
            timestamp: function() {
                return (new Date()).toJSON();
            },
            formatter: function(options) {
                return options.timestamp() + ' ' + options.level.toUpperCase() + ' ' + (options.message ? options.message : '') +
                    (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
            }
        }});

    winston.loggers.add('auditlog', {
        file: {
            level: 'info',
            filename: path.join(logging_path, audit.auditLog),
            json: false,
            stderrLevels: ['error'],
            timestamp: function() {
                return (new Date()).toJSON();
            },
            formatter: function(options) {
                return options.timestamp() + ' ' + (options.message ? options.message : '') +
                    (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
            }
        }});

    logger.applog = winston.loggers.get('applog');
    logger.applog.transports['console'].silent = true;

    logger.auditlog = winston.loggers.get('auditlog');
    logger.auditlog.transports['console'].silent = true;
    */

    logger.log_failed_logins = (val) => {
        if (audit.failedLogins === true){
            logger.auditlog.info(val);
        }
    };

    logger.log_successful_logins = (val) => {
        if (audit.successfulLogins === true){
            logger.auditlog.info(val);
        }
    };

    logger.log_password_changes = (val) => {
        if (audit.passwordChanges === true){
            logger.auditlog.info(val);
        }
    };

    logger.log_account_operations = (val) => {
        if (audit.accountOperations === true){
            logger.auditlog.info(val);
        }
    };

    logger.log_token_refresh_success = (val) => {
        if (audit.tokenRefreshSuccess === true){
            logger.auditlog.info(val);
        }
    };

    logger.log_token_refresh_fail = (val) => {
        if (audit.tokenRefreshFail === true){
            logger.auditlog.info(val);
        }
    };

    logger.log_claim_request = (val) => {
        if (audit.claimRequestLogging === true){
            logger.auditlog.info(val);
        }
    };

    logger.applog.info('Logging Started');

    return logger;
};