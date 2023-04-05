const debug = require('debug');
const log = debug('perkara-service:services:');

const { isEmpty } = require('lodash');
const fs = require('fs');
const moment = require('moment');

const { Upload } = require('../helpers/uploads');

const { 
    Lapdumas, 
    File_lapdumas,
    Master_file_lapdumas,
    // Users, 
    Logs 
} = require('../models');
const { Op } = require('sequelize');

const year = moment().format('YYYY');
const month = moment().format('MM');

async function Create (fileData, files, user) {
    const { 
        id_lapdumas, 
        id_master_file, 
        tanggal 
    } = fileData;
    log('[File Lapdumas] Create', { fileData, files, user });
    try {
        if (!tanggal || !id_master_file) throw { error: 'Tanggal dan master file harus dilampirkan.' };

        const checkLapdumas = await Lapdumas.findOne({
            where: { id: id_lapdumas },
            raw: true
        });
        if (!checkLapdumas) throw { error: 'Data lapdumas tidak tersedia.' };

        if (isEmpty(files)) throw { error: 'File lapdumas harus dilampirkan.' };

        const checkMasterFileLapdumas = await Master_file_lapdumas.findAll({});
        if (isEmpty(checkMasterFileLapdumas)) throw { error: 'Master file lapdumas masih kosong.' };

        await Upload(files, year, month, checkLapdumas.id);

        const destination = `${process.env.DESTINATION_FILE}/${year}/${month}/${checkLapdumas.id}`;
        const path = `${process.env.PATH_FILE}/${year}/${month}/${checkLapdumas.id}`;
        const created = await File_lapdumas.create({
            id_lapdumas,
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
            logdetail: `(Tambah) dokumen lapdumas dengan nomor laporan ${checkLapdumas.no_laporan}.`,
            user_id: user.id
        });

        return {
            message: 'Dokumen lapdumas berhasil ditambah.',
            data: await File_lapdumas.findOne({
                where: { id: created.id },
                raw: true
            })
        };
    } catch (error) {
        return error;
    }
}

async function Update (fileData, files, fileId, user) {
    const { id_lapdumas, id_master_file } = fileData;
    log('[File Lapdumas] Update', { fileData, files, fileId, user });
    try {
        const checkFileData = await File_lapdumas.findOne({
            where: { id: fileId },
            raw: true
        });
        if (!checkFileData) throw { error: `File data dengan ID ${fileId} tidak tersedia.` };

        const lapdumasData = await Lapdumas.findOne({
            where: { id: checkFileData.id_lapdumas },
            raw: true
        });

        if (isEmpty(files)) throw { error: 'File lapdumas harus dilampirkan.' };

        await Upload(files, year, month, id_lapdumas);

        const destination = `${process.env.DESTINATION_FILE}/${year}/${month}/${id_lapdumas}/`;
        const path = `${process.env.PATH_FILE}/${year}/${month}/${id_lapdumas}/`;
        await File_lapdumas.update({
            id_lapdumas,
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
            logdetail: `(Tambah) dokumen lapdumas dengan nomor laporan ${lapdumasData.no_laporan}.`,
            user_id: user.id
        });

        return {
            message: 'Dokumen lapdumas berhasil ditambah.',
            data: await File_lapdumas.findOne({
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