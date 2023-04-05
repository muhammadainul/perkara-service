const { Client } = require('node-scp');
const fs = require('fs');

module.exports = {
    Upload: async (imageData, year, month, id_perkara) => {
        console.log('Image data', { imageData, year, month, id_perkara });
        try {
            const client = await Client({
                host: process.env.SCP_HOST,
                port: process.env.SCP_PORT,
                username: process.env.SCP_USERNAME,
                password: process.env.SCP_PASS
            });
            console.log('client', client);

            const result = await client.exists(`/var/nginx/html/app/uploads/files/${year}/${month}/${id_perkara}`);
            if (result == false) await client.mkdir(`/var/nginx/html/app/uploads/files/${year}/${month}/${id_perkara}`);
            
            await client.uploadFile(`./uploads/files/${imageData.filename}`, 
                `/var/nginx/html/app/uploads/files/${year}/${month}/${id_perkara}/${imageData.filename}`);

            fs.unlinkSync(`./uploads/files/${imageData.filename}`);
            // await client.list('/')
            client.close();
        } catch (error) {
            console.log('error', error);
            return error;
        }
    },
    Delete: async (filename) => {
        try {
            const client = await Client({
                host: 'web.hmadev',
                port: 22,
                username: 'root',
                password: 'kadalijo'
            });
            console.log('client', client);
            await client.downloadFile(`/var/nginx/html/app/uploads/files/${filename}`, `./uploads/files/${filename}`);
    
            fs.unlinkSync(`./uploads/files/${filename}`);
            // await client.list('/')
            client.close();
        } catch (error) {
            throw error;
        }
    }
}