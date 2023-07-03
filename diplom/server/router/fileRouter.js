import { Router } from "express";
import FileController from "../controller/fileController.js";
import upload from "../middleware/fileMiddleware.js";

const router = new Router();

router.post('/upload', upload.single('file'), FileController.getFileName);
router.get('/download/:name', FileController.downloadFile);
router.delete('/:name', FileController.removeFile);

export default router;