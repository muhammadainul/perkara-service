const debug = require('debug');
const log = debug('perkara-service:services:');

const { isEmpty } = require('lodash');
const fs = require('fs');
const moment = require('moment');

const { Upload } = require('../helpers/uploads');

const { 
    Penyelidikan, 
    File_penyelidikan,
    Master_file_penyelidikan,
    // Users, 
    Logs 
} = require('../models');
const { Op } = require('sequelize');

const year = moment().format('YYYY');
const month = moment().format('MM');

async function Create (fileData, files, user) {
    const { 
        id_penyelidikan, 
        id_master_file,
        tanggal 
    } = fileData;
    log('[File Penyelidikan] Create', { fileData, files, user });
    try {
        if (!id_penyelidikan) throw { error: 'Penyelidikan harus dilampirkan.' };
        
        if (!tanggal || !id_master_file) throw { error: 'Tanggal dan master file harus dilampirkan.' };

        const checkPenyelidikan = await Penyelidikan.findOne({
            where: { id: id_penyelidikan },
            raw: true
        });
        if (!checkPenyelidikan) throw { error: 'Data penyelidikan tidak tersedia.' };

        if (isEmpty(files)) throw { error: 'File penyelidikan harus dilampirkan.' };

        const checkMasterFilePenyelidikan = await Master_file_penyelidikan.findAll({});
        if (isEmpty(checkMasterFilePenyelidikan)) throw { error: 'Master file penyelidikan masih kosong.' };

        await Upload(files, year, month, checkPenyelidikan.id);

        const destination = `${process.env.DESTINATION_FILE}/${year}/${month}/${checkPenyelidikan.id}`;
        const path = `${process.env.PATH_FILE}/${year}/${month}/${checkPenyelidikan.id}`;
        const created = await File_penyelidikan.create({
            id_penyelidikan,
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
            logdetail: `(Tambah) dokumen penyelidikan dengan nomor laporan ${checkPenyelidikan.no_laporan}.`,
            user_id: user.id
        });

        return {
            message: 'Dokumen penyelidikan berhasil ditambah.',
            data: await File_penyelidikan.findOne({
                where: { id: created.id },
                raw: true
            })
        };
    } catch (error) {
        return error;
    }
}

async function Update (fileData, files, fileId, user) {
    const { id_penyelidikan, id_master_file } = fileData;
    log('[File Penyelidikan] Update', { fileData, files, fileId, user });
    try {
        const checkFileData = await File_penyelidikan.findOne({
            where: { id: fileId },
            raw: true
        });
        if (!checkFileData) throw { error: `File data dengan ID ${fileId} tidak tersedia.` };

        const penyelidikanData = await Penyelidikan.findOne({
            where: { id: checkFileData.id_penyelidikan },
            raw: true
        });

        if (isEmpty(files)) throw { error: 'File penyelidikan harus dilampirkan.' };

        await Upload(files, year, month, id_penyelidikan);

        const destination = `${process.env.DESTINATION_FILE}/${year}/${month}/${id_penyelidikan}/`;
        const path = `${process.env.PATH_FILE}/${year}/${month}/${id_penyelidikan}/`;
        await File_penyelidikan.update({
            id_penyelidikan,
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
            logdetail: `(Tambah) dokumen penyelidikan dengan nomor laporan ${penyelidikanData.no_laporan}.`,
            user_id: user.id
        });

        return {
            message: 'Dokumen penyelidikan berhasil ditambah.',
            data: await File_penyelidikan.findOne({
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