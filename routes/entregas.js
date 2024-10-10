import express from 'express';

import { getEntregas, getEntregaById, getEntregasAbertas } from '../controllers/entregas.js'

const router = express.Router();

router.get('/', getEntregas);
router.get('/abertas/', getEntregasAbertas);
router.get('/:idEntrega', getEntregaById);

export default router;