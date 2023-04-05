const express = require('express');
const router = express.Router();
const debug = require('debug');
const log = debug('perkara-service:file_penyelidikan:');

const FileService = require('../../services/file_penyelidikan');
// const ArchiveService = require('../../services/archive');

const { isVerified } = require('../../middlewares/isVerified');
const { isSecured } = require('../../middlewares/isSecured');

router.post('/', [isSecured, isVerified], async (req, res) => {
    const fileData = req.body;
    const files = req.file;
    const user = req.user;

    const result = await FileService.Create(fileData, files, user);
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
    const fileData = req.body;
    const fileId = req.params.id;
    const files = req.file;
    const user = req.user;

    const result = await FileService.Update(fileData, files, fileId, user);
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

// router.post('/archive', [isSecured, isVerified], async (req, res) => {
//     const archiveData = req.body;
//     const user = req.user;

//     const result = await ArchiveService.Compress(archiveData, user);
//     log('result', result);

//     if (result.error) {
//         return res.status(400).json({ 
//             status: 400, 
//             error: result.error 
//         });
//     } else {
//         return res.status(200).json({
//             status: 200, 
//             data: result
//         });
//     }
// });

module.exports = router;