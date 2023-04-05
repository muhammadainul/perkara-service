const multer = require('multer');
const express = require('express');
const app = express();

const path = require('path');
const moment = require('moment');
const passport = require('passport');

require('dotenv').config();

global.config = require('./config/config')[process.env.NODE_ENV];

const multerMiddleware = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null,  "./uploads/files")
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname.split('.').slice(0, -1).join('.') + '-' + moment(Date.now()).format('YYYY-MM-DDhh:mm:ss') + path.extname(file.originalname))
        }
    }),
    limits: {
        fileSize: 60000000
    }
});

app.use(multerMiddleware.single('files'));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

require("./config/passport")(passport);
app.use(passport.initialize());

app.use(async (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, sifig_token'
    );
    if (req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'
        );
        return res.status(200).json({});
    }
    next();
});

// routes
app.use('/v1/lapdumas', require('./controllers/v1/lapdumas'));
app.use('/v1/file_lapdumas', require('./controllers/v1/file_lapdumas'));
app.use('/v1/master_file_lapdumas', require('./controllers/v1/master_file_lapdumas'));
app.use('/v1/penyelidikan', require('./controllers/v1/penyelidikan'));
app.use('/v1/file_penyelidikan', require('./controllers/v1/file_penyelidikan'));
app.use('/v1/master_file_penyelidikan', require('./controllers/v1/master_file_penyelidikan'));
app.use('/v1/perkara', require('./controllers/v1/perkara'));
app.use('/v1/kategori_perkara', require('./controllers/v1/kategori_perkara'));
app.use('/v1/file_perkara', require('./controllers/v1/file_perkara'));
app.use('/v1/master_file_perkara', require('./controllers/v1/master_file_perkara'));
app.use('/v1/penyidikan', require('./controllers/v1/penyidikan'));
app.use('/v1/log_penyidikan', require('./controllers/v1/log_penyidikan'));
app.use('/v1/file_penyidikan', require('./controllers/v1/file_penyidikan'));
app.use('/v1/satker', require('./controllers/v1/satker'));
app.use('/v1/report', require('./controllers/v1/report'));
app.use('/v1/log_perkara', require('./controllers/v1/log_perkara'));
app.use('/v1/log_penyelidikan', require('./controllers/v1/log_penyelidikan'));
app.use('/v1/bantuan', require('./controllers/v1/bantuan'));
app.use('/v1/compress', require('./controllers/v1/compress'));
app.use('/v1/log_integration', require('./controllers/v1/log_integration'));

module.exports = app;