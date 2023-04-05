const express = require('express');
const router = express.Router();
const debug = require('debug');
const log = debug('perkara-service:log_penyelidikan:');

const LogPenyelidikanService = require('../../services/log_penyelidikan');

const { isVerified } = require('../../middlewares/isVerified');
const { isSecured } = require('../../middlewares/isSecured');

router.post('/', [isSecured, isVerified], async (req, res) => {
    const logData = req.body;
    const user = req.user;

    const result = await LogPenyelidikanService.Create(logData, user);
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

router.get('/get/:id', [isSecured, isVerified], async (req, res) => {
    const penyelidikan_id = req.params.id;

    const result = await LogPenyelidikanService.GetById(penyelidikan_id)
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

router.post('/datatables', [isSecured, isVerified], async (req, res) => {
    const logData = req.body;

    const result = await LogPenyelidikanService.GetDatatables(logData);
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

router.post('/datatables/detail', [isSecured, isVerified], async (req, res) => {
    const logData = req.body;

    const result = await LogPenyelidikanService.GetDatatablesDetail(logData);
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