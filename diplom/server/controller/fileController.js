import FileService from "../service/fileService.js";
import fs from 'fs';

export default new class fileController {

    getFileName(req, res, next) {
        try {
            const file = req.file;
            const fileName = FileService.getFileName(file);
            
            res.status(201).json(fileName);
        } catch(e) {
            next(e);
        }
    }

    async downloadFile(req, res, next) {
        try {
            const {name} = req.params;
            const fileData = FileService.downloadFile(name);

            res.download(fileData.path, fileData.name);            
        } catch(e) {
            next(e);
        }
    }

    async removeFile(req, res, next) {
        try {
            const {name} = req.params;
            await FileService.removeFile(name);

            res.sendStatus(200);
        } catch(e) {
            next(e);
        }
    }
}

