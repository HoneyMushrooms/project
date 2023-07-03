import ApiError from "../exception/apiError.js"
import path from 'path';
import { unlink } from 'node:fs/promises';

export default new class FileService {

    pathFiles = path.join(path.resolve(''), '/file');

    async removeFile(file) {
        if(!file) {
            throw ApiError.BadRequest('Файла не существует');
        }
        const pathFile = path.join(this.pathFiles, file);
        await unlink(pathFile);
    }

    getFileName(file) {
        if(!file) {
            throw ApiError.BadRequest('Файл не загрузился');
        }
        return file.filename;
    }

    downloadFile(file) {
        if(!file) {
            throw ApiError.BadRequest('Файла не существует');
        }
        const filePath = path.join(this.pathFiles, file);
        const fileName = file.split('-').splice(1).join('-');
        
        return {path: filePath, name: fileName};
    }
}
