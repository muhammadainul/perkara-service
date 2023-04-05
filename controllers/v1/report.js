const express = require('express');
const router = express.Router();
const debug = require('debug');
const log = debug('perkara-service:report:');

const ReportService = require('../../services/report');

const { isVerified } = require('../../middlewares/isVerified');
const { isSecured } = require('../../middlewares/isSecured');

router.post('/', [isSecured, isVerified], async (req, res) => {
    const reportData = req.body;
    const user = req.user;

    const result = await ReportService.Get(reportData, user);
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

router.get('/perkara/top', [isSecured, isVerified], async (req, res) => {
    const result = await ReportService.GetTopPerkara()
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

router.post('/perkara/graph', [isSecured, isVerified], async (req, res) => {
    const reportData = req.body;

    const result = await ReportService.GetGraphPerkara(reportData)
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

router.post('/logperkara/traffic', [isSecured, isVerified], async (req, res) => {
    const kategoriData = req.body;

    const result = await ReportService.GetLogTraffic(kategoriData)
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

router.get('/logperkara/graph', [isSecured, isVerified], async (req, res) => {
    const result = await ReportService.GetGraphTraffic()
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

router.post('/notif', [isSecured, isVerified], async (req, res) => {
    const notifData = req.body;

    const result = await ReportService.GetNotif(notifData)
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

router.post('/digital', async (req, res) => {
    const reportData = req.body;

    const result = await ReportService.GetDatatablesDigital(reportData)
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

router.post('/exporter',  async (req, res) => {
    const reportData = req.body;

    const result = await ReportService.GetReportExporter(reportData)
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