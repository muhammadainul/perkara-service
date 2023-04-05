const debug = require('debug');
const log = debug('perkara-service:file_penyidikan:services:');

const { isEmpty } = require('lodash');
const moment = require('moment');

const { Upload } = require('../helpers/uploads');

const { 
    Penyidikan, 
    File_penyidikan,
    // Users, 
    Logs 
} = require('../models');

const year = moment().format('YYYY');
const month = moment().format('MM');

async function Create (fileData, files, user) {
    const { 
        id_penyidikan, 
        tanggal 
    } = fileData;
    log('[File Penyidikan] Create', { fileData, files, user });
    try {
        if (!id_penyidikan) throw { error: 'Penyidikan harus dilampirkan.' };
        
        if (!tanggal) throw { error: 'Tanggal harus dilampirkan.' };

        const checkPenyidikan = await Penyidikan.findOne({
            where: { id: id_penyidikan },
            raw: true
        });
        if (!checkPenyidikan) throw { error: 'Data penyidikan tidak tersedia.' };

        if (isEmpty(files)) throw { error: 'File penyidikan harus dilampirkan.' };

        await Upload(files, year, month, checkPenyidikan.id);

        const destination = `${process.env.DESTINATION_FILE}/${year}/${month}/${checkPenyidikan.id}`;
        const path = `${process.env.PATH_FILE}/${year}/${month}/${checkPenyidikan.id}`;
        const created = await File_penyidikan.create({
            id_penyidikan,
            destination,
            filename: files.filename,
            path,
            id_master_file,
            tanggal
        });

        await Logs.create({
            ip_address: user.ip_address,
            browser: user.browser,
            browser_version: user.browser_version,
            os: user.os,
            logdetail: `(Tambah) dokumen penyidikan dengan nomor laporan ${checkPenyidikan.no_sprintdik}.`,
            user_id: user.id
        });

        return {
            message: 'Dokumen penyidikan berhasil ditambah.',
            data: await File_penyidikan.findOne({
                where: { id: created.id },
                raw: true
            })
        };
    } catch (error) {
        return error;
    }
}

async function Update (fileData, files, fileId, user) {
    const { id_penyidikan, id_master_file } = fileData;
    log('[File Penyidikan] Update', { fileData, files, fileId, user });
    try {
        const checkFileData = await File_penyidikan.findOne({
            where: { id: fileId },
            raw: true
        });
        if (!checkFileData) throw { error: `File data dengan ID ${fileId} tidak tersedia.` };

        const penyidikanData = await Penyidikan.findOne({
            where: { id: checkFileData.id_penyidikan },
            raw: true
        });

        if (isEmpty(files)) throw { error: 'File penyidikan harus dilampirkan.' };

        await Upload(files, year, month, id_penyidikan);

        const destination = `${process.env.DESTINATION_FILE}/${year}/${month}/${id_penyidikan}/`;
        const path = `${process.env.PATH_FILE}/${year}/${month}/${id_penyidikan}/`;
        await File_penyidikan.update({
            id_penyidikan,
            destination,
            filename: files.filename,
            path,
            id_master_file
            },
            { where: { id: fileId } }
        );

        await Logs.create({
            ip_address: user.ip_address,
            browser: user.browser,
            browser_version: user.browser_version,
            os: user.os,
            logdetail: `(Tambah) dokumen penyidikan dengan nomor laporan ${penyidikanData.no_sprintdik}.`,
            user_id: user.id
        });

        return {
            message: 'Dokumen penyidikan berhasil ditambah.',
            data: await File_penyidikan.findOne({
                where: { id: checkFileData.id },
                raw: true
            })
        };
    } catch (error) {
        return error;
    }
}

module.exports = {
    Create,
    Update
}