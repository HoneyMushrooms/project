import multer from 'multer';
import FileService from '../service/fileService.js';
import {existsSync, mkdirSync} from 'fs';

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            
            if (!existsSync(FileService.pathFiles)) {
                mkdirSync(FileService.pathFiles, { recursive: true })
            }
            
            cb(null, FileService.pathFiles);
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        }
    })
})
        
export default upload;
