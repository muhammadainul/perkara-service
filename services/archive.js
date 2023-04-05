const debug = require('debug');
const log = debug('perkara-service:services:');

const { Upload } = require('../helpers/uploads');

const { 
    Perkara, 
    File_perkara,
    Lapdumas,
    File_lapdumas,
    Penyelidikan,
    Penyidikan,
    File_penyidikan,
    File_penyelidikan,
    Logs 
} = require('../models');
const { Op } = require('sequelize');

const fs = require('fs');
const moment = require('moment');
const { execute } = require('@getvim/execute');
const { isEmpty } = require('lodash');

const year = moment().format('YYYY');
const month = moment().format('MM');

async function Compress (archiveData, user) {
    const {
        id_lapdumas,
        id_penyelidikan,
        id_penyidikan,
        id_perkara
    } = archiveData;
    log('[Arcive] Compress', { archiveData, user });
    try {
        // if (!id_lapdumas || !id_penyelidikan || !id_perkara) 
        //     throw { error: 'Harus melampirkan salah satu ID.' };

        let check;
        let checkFile;

        if (id_lapdumas) {
            check = await Lapdumas.findOne({ 
                where: { id: id_lapdumas },
                raw: true
            });
            if (!check) throw { error: 'Data lapdumas tidak tersedia.' };

            checkFile = await File_lapdumas.findAll({
                where: { 
                    id_lapdumas,
                    destination: { [Op.ne]: null },
                    filename: { [Op.ne]: '' } 
                },
                raw: true
            }); 

            if (isEmpty(checkFile)) throw { error: 'File lapdumas tidak tersedia.' };
        }

        if (id_penyelidikan) {
            check = await Penyelidikan.findOne({ 
                where: { id: id_penyelidikan },
                raw: true
            });
            if (!check) throw { error: 'Data penyelidikan tidak tersedia.' };

            checkFile = await File_penyelidikan.findAll({
                where: {
                    id_penyelidikan,
                    destination: { [Op.ne]: null },
                    filename: { [Op.ne]: '' }
                },
                raw: true
            }); 

            if (isEmpty(checkFile)) throw { error: 'File penyelidikan tidak tersedia.' };
        }

        if (id_penyidikan) {
            check = await Penyidikan.findOne({ 
                where: { id: id_penyidikan },
                raw: true
            });
            if (!check) throw { error: 'Data penyidikan tidak tersedia.' };

            checkFile = await File_penyidikan.findAll({
                where: { 
                    id_penyidikan,
                    destination: { [Op.ne]: null },
                    filename: { [Op.ne]: '' }
                },
                raw: true
            }); 

            if (isEmpty(checkFile)) throw { error: 'File penyidikan tidak tersedia.' };
        }

        if (id_perkara) {
            check = await Perkara.findOne({ 
                where: { id: id_perkara },
                raw: true
            });
            if (!check) throw { error: 'Data perkara tidak tersedia.' };

            checkFile = await File_perkara.findAll({
                where: { 
                    id_perkara, 
                    destination: { [Op.ne]: null },
                    filename: { [Op.ne]: '' }
                }, 
                raw: true
            }); 

            if (isEmpty(checkFile)) throw { error: 'File perkara tidak tersedia.' };
        }

        for (let i of checkFile) {
            const filename = i.filename.split('base64,')[1];

            fs.writeFileSync(`./uploads/files/${i.destination}`, filename, 'base64');

            await Upload(i.destination, year, month, check.id);
        }

        const path = `${process.env.PATH_FILE}/${year}/${month}/${check.id}`;
        execute(
            `cd ${path} && zip -j ${check.id}.zip *`
        )
            .then(() => {
                log('Zip berhasil.');
            })
            .catch((error) => {
                log('error', error);
            });   
            
        // execute(
        //     `sshpass -p "kadalijo" ssh root@web.hmadev "cd ${checkFile[0].path} && zip -j ${check.id}.zip *"`
        // )
        //     .then(() => {
        //         log('Zip berhasil.');
        //     })
        //     .catch((error) => {
        //         log('error', error);
        //     });   
        
        await Logs.create({
            ip_address: user.ip_address,
            browser: user.browser,
            browser_version: user.browser_version,
            os: user.os,
            logdetail: `(Archive) file ZIP dengan ID ${check.id}.`,
            user_id: user.id
        });

        return {
            message: 'ZIP folder berhasil dibuat.',
            data: `${process.env.DESTINATION_FILE}/${year}/${month}/${check.id}/${check.id}.zip`
        };
    } catch (error) {
        return error;
    }
}

module.exports = {
    Compress
}