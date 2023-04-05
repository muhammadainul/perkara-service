const express = require('express');
const router = express.Router();
const debug = require('debug');
const log = debug('perkara-service:log_integration:');

const LogIntegrationService = require('../../services/log_integration');

const { isVerified } = require('../../middlewares/isVerified');
const { isSecured } = require('../../middlewares/isSecured');

router.post('/', [isSecured, isVerified], async (req, res) => {
    const logData = req.body;
    const user = req.user;

    const result = await LogIntegrationService.GetLog(logData, user);
    log('result', result);

    if (result.error) {
        return res.status(400).json({ 
            status: 400, 
            error: result.error 
        });
    } else {
        return res.status(200).json({
            status: 200, 
            data: result
        });
    }
});

module.exports = router;