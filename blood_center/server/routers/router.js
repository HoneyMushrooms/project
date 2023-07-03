import { Router } from "express";
import Controller from "../controller/controller.js";

const router = new Router();

router.post('/query', Controller.query);
router.get('/sse_query', Controller.sse_query);
router.get('/sse_reserve', Controller.sse_reserve);
router.get('/donors', Controller.get_donors);
router.patch('/update_reserve', Controller.update_reserve);
router.patch('/update_date_query', Controller.update_date_query);

export default router;