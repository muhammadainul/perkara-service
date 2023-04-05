const express = require('express');
const router = express.Router();
const debug = require('debug');
const log = debug('perkara-service:lapdumas:');

const LapdumasService = require('../../services/lapdumas');

const { isVerified } = require('../../middlewares/isVerified');
const { isSecured } = require('../../middlewares/isSecured');

router.post('/', [isSecured, isVerified], async (req, res) => {
    const lapdumasData = req.body;
    const user = req.user;

    const result = await LapdumasService.Create(lapdumasData, user);
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
    const lapdumasData = req.body;

    const result = await LapdumasService.GetDatatables(lapdumasData);
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

router.get('/list', [isSecured, isVerified], async (req, res) => {
    const result = await LapdumasService.Get();
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

router.get('/:id', [isSecured, isVerified], async (req, res) => {
    const lapdumas_id = req.params.id;

    const result = await LapdumasService.GetById(lapdumas_id);
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

router.get('/qrcode/:id', async (req, res) => {
    const lapdumas_id = req.params.id;

    const result = await LapdumasService.GetById(lapdumas_id);
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

router.post('/qrcode/no_laporan', async (req, res) => {
    const lapdumasData = req.body;

    const result = await LapdumasService.GetByNo(lapdumasData);
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

router.post('/list', [isSecured, isVerified], async (req, res) => {
    const lapdumasData = req.body;

    const result = await LapdumasService.List(lapdumasData);
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