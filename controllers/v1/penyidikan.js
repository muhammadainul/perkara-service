const express = require('express');
const router = express.Router();
const debug = require('debug');
const log = debug('perkara-service:penyidikan:');

const PenyidikanService = require('../../services/penyidikan');

const { isVerified } = require('../../middlewares/isVerified');
const { isSecured } = require('../../middlewares/isSecured');

router.post('/', [isSecured, isVerified], async (req, res) => {
    const penyidikanData = req.body;
    const user = req.user;

    const result = await PenyidikanService.Create(penyidikanData, user);
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
    const penyidikan_id = req.params.id;
    const penyidikanData = req.body;
    const user = req.user;

    const result = await PenyidikanService.Update(penyidikan_id, penyidikanData, user);
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

router.put('/status/:id', [isSecured, isVerified], async (req, res) => {
    const penyidikan_id = req.params.id;
    const penyidikanData = req.body;
    const user = req.user;

    const result = await PenyidikanService.UpdateStatus(penyidikan_id, penyidikanData, user);
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

router.delete('/:id', [isSecured, isVerified], async (req, res) => {
    const penyidikan_id = req.params.id;
    const user = req.user;

    const result = await PenyidikanService.Delete(penyidikan_id, user);
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
    const penyidikanData = req.body;

    const result = await PenyidikanService.GetDatatables(penyidikanData);
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
    const penyidikanData = req.body;

    const result = await PenyidikanService.DatatablesSearchValue(penyidikanData);
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

router.post('/get', [isSecured, isVerified], async (req, res) => {
    const penyelidikanData = req.body;

    const result = await PenyidikanService.GetById(penyelidikanData);
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
    const result = await PenyidikanService.Get();
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
    const penyidikan_id = req.params.id;

    const result = await PenyidikanService.GetById(penyidikan_id);
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

router.post('/qrcode/no_sprintidik', async (req, res) => {
    const penyidikanData = req.body;

    const result = await PenyidikanService.GetByNo(penyidikanData);
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

    const result = await PenyidikanService.List(perkaraData);
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
    const penyidikanData = req.body;

    const result = await PenyidikanService.ListNotExists(penyidikanData);
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
    const penyidikanData = req.body;

    const result = await PenyidikanService.TotalData(penyidikanData);
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