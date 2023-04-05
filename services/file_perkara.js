const debug = require('debug');
const log = debug('perkara-service:services:');

const { isEmpty } = require('lodash');
const fs = require('fs');
const moment = require('moment');

const { Upload } = require('../helpers/uploads');

const { 
    Perkara, 
    File_perkara, 
    // Users, 
    Logs 
} = require('../models');
const { Op } = require('sequelize');

const year = moment().format('YYYY');
const month = moment().format('MM');

async function Create (fileData, files, user) {
    const { 
        id_perkara, 
        id_master_file,
        tanggal 
    } = fileData;
    log('[File Perkara] Create', { fileData, files, user });
    try {
        if (!tanggal || !id_master_file) throw { error: 'Tanggal dan master file harus dilampirkan.' };

        const checkPerkara = await Perkara.findOne({
            where: { id: id_perkara },
            raw: true
        });
        if (!checkPerkara) throw { error: 'Data perkara tidak tersedia.' };

        if (isEmpty(files)) throw { error: 'File perkara harus dilampirkan.' };

        await Upload(files, year, month, checkPerkara.id);

        const destination = `${process.env.DESTINATION_FILE}/${year}/${month}/${checkPerkara.id}`;
        const path = `${process.env.PATH_FILE}/${year}/${month}/${checkPerkara.id}`;
        const created = await File_perkara.create({
            id_perkara,
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
            logdetail: `(Tambah) dokumen perkara dengan nomor perkara ${checkPerkara.no_perkara}.`,
            user_id: user.id
        });

        // cek dan update status jika file perkara sudah 15
        const checkFile = await File_perkara.findAll({
            where: { id_perkara },
            raw: true
        });
        if (checkFile.length == 15)  
            await Perkara.update(
                { status: true },
                { where: { id: id_perkara }}
            )

        return {
            message: 'Dokumen perkara berhasil ditambah.',
            data: await File_perkara.findOne({
                where: { id: created.id },
                raw: true
            })
        };
    } catch (error) {
        return error;
    }
}

async function Update (fileData, files, fileId, user) {
    const { deleted, id_perkara, id_master_file } = fileData;
    log('[File Perkara] Update', { fileData, files, fileId, user });
    try {
        const checkFileData = await File_perkara.findOne({
            where: { id: fileId },
            raw: true
        });
        if (!checkFileData) throw { error: `File data dengan ID ${fileId} tidak tersedia.` };

        const perkaraData = await Perkara.findOne({
            where: { id: checkFileData.id_perkara },
            raw: true
        });

        // cek jika payload deleted = true, lalu ubah status perkara
        if (deleted == true) {
            await File_perkara.update({
                destination: null,
                filename: null,
                path: null
                },
                { where: { id: fileId } }
            )

            // fs.unlinkSync(`./uploads/files/${files.filename}`);

            // cek file jika ada filename masih null lalu update status 
            const checkFile = await File_perkara.findAll({
                where: {
                    [Op.and]: [
                        { id_perkara: perkaraData.id }, 
                        { filename: null }
                    ]
                },
                raw: true
            });
            if (checkFile.length > 0)  
                await Perkara.update(
                    { status: false },
                    { where: { id: perkaraData.id } }
                )

            await Logs.create({
                ip_address: user.ip_address,
                browser: user.browser,
                browser_version: user.browser_version,
                os: user.os,
                logdetail: `(Hapus) dokumen perkara dengan nomor perkara ${perkaraData.no_perkara}.`,
                user_id: user.id
            });

            return {
                message: 'Dokumen perkara berhasil dihapus.'
            };
        } 

        if (isEmpty(files)) throw { error: 'File perkara harus dilampirkan.' };

        await Upload(files, year, month, id_perkara);

        const destination = `${process.env.DESTINATION_FILE}/${year}/${month}/${id_perkara}/`;
        const path = `${process.env.PATH_FILE}/${year}/${month}/${id_perkara}/`;
        await File_perkara.update({
            id_perkara,
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
            logdetail: `(Tambah) dokumen perkara dengan nomor perkara ${perkaraData.no_perkara}.`,
            user_id: user.id
        });

        // cek dan update status menjadi true jika file perkara sudah 16
        const checkFile = await File_perkara.findAll({
            where: { 
                [Op.and]: [
                    { id_perkara: perkaraData.id }, 
                    { filename: { [Op.ne]: null } }
                ]
            },
            raw: true
        });
        if (checkFile.length == 16)  
            await Perkara.update(
                { status: true },
                { where: { id: perkaraData.id } }
            )

        return {
            message: 'Dokumen perkara berhasil ditambah.',
            data: await File_perkara.findOne({
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