const express = require('express');
const router = express.Router();
const debug = require('debug');
const log = debug('perkara-service:perkara:');

const PerkaraService = require('../../services/perkara');
const ArchiveService = require('../../services/archive');

const { isVerified } = require('../../middlewares/isVerified');
const { isSecured } = require('../../middlewares/isSecured');

router.post('/', [isSecured, isVerified], async (req, res) => {
    const perkaraData = req.body;
    const user = req.user;

    const result = await PerkaraService.Create(perkaraData, user);
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

router.post('/datatables', async (req, res) => {
    const perkaraData = req.body;

    const result = await PerkaraService.GetDatatables(perkaraData);
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
    const perkaraData = req.body;

    const result = await PerkaraService.DatatablesAdvancedSearch(perkaraData);
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

router.post('/datatables/search', [isSecured, isVerified], async (req, res) => {
    const perkaraData = req.body;

    const result = await PerkaraService.DatatablesSearch(perkaraData);
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
    const perkaraData = req.body;

    const result = await PerkaraService.TotalData(perkaraData);
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
    const result = await PerkaraService.Get();
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
    const perkaraData = req.body;

    const result = await PerkaraService.GetById(perkaraData);
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
    const perkaraId = req.params.id;

    const result = await PerkaraService.GetById(perkaraId);
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

router.post('/qrcode/no_perkara', async (req, res) => {
    const perkaraData = req.body;

    const result = await PerkaraService.GetByNo(perkaraData);
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

router.post('/kategori', [isSecured, isVerified], async (req, res) => {
    const perkaraData = req.body;

    const result = await PerkaraService.List(perkaraData);
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
    const perkaraId = req.params.id;
    const perkaraData = req.body;
    const user = req.user;

    const result = await PerkaraService.Update(perkaraId, perkaraData, user);
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
    const perkaraId = req.params.id;
    const perkaraData = req.body;
    const user = req.user;

    const result = await PerkaraService.UpdateStatus(perkaraId, perkaraData, user);
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
    const perkaraId = req.params.id;
    const user = req.user;

    const result = await PerkaraService.Delete(perkaraId, user);
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

router.post('/compress', [isSecured, isVerified], async (req, res) => {
    const perkaraData = req.body;
    const archiveFile = req.file;

    const result = await ArchiveService.Compress(perkaraData, archiveFile);
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