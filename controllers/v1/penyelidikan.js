const express = require('express');
const router = express.Router();
const debug = require('debug');
const log = debug('perkara-service:penyelidikan:');

const PenyelidikanService = require('../../services/penyelidikan');

const { isVerified } = require('../../middlewares/isVerified');
const { isSecured } = require('../../middlewares/isSecured');

router.post('/', [isSecured, isVerified], async (req, res) => {
    const penyelidikanData = req.body;
    const user = req.user;

    const result = await PenyelidikanService.Create(penyelidikanData, user);
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

router.put('/:id', [isSecured, isVerified], async (req, res) => {
    const penyelidikan_id = req.params.id;
    const perkaraData = req.body;
    const user = req.user;

    const result = await PenyelidikanService.Update(penyelidikan_id, perkaraData, user);
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
    const penyelidikanData = req.body;

    const result = await PenyelidikanService.GetDatatables(penyelidikanData);
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

router.post('/datatables/search/value', [isSecured, isVerified], async (req, res) => {
    const penyelidikanData = req.body;

    const result = await PenyelidikanService.DatatablesSearchValue(penyelidikanData);
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
    const penyelidikan_id = req.params.id;

    const result = await PenyelidikanService.GetById(penyelidikan_id);
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

router.get('/get/list', [isSecured, isVerified], async (req, res) => {
    const result = await PenyelidikanService.Get();
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
    const penyelidikan_id = req.params.id;

    const result = await PenyelidikanService.GetById(penyelidikan_id);
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

router.post('/qrcode/no_p2', async (req, res) => {
    const penyelidikanData = req.body;

    const result = await PenyelidikanService.GetByNo(penyelidikanData);
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
    const perkaraData = req.body;

    const result = await PenyelidikanService.List(perkaraData);
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

router.post('/user', [isSecured, isVerified], async (req, res) => {
    const penyelidikanData = req.body;

    const result = await PenyelidikanService.ListNotExists(penyelidikanData);
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

router.post('/count/total', [isSecured, isVerified], async (req, res) => {
    const penyelidikanData = req.body;

    const result = await PenyelidikanService.TotalData(penyelidikanData);
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