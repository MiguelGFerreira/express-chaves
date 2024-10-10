import express from 'express';

import { getEntregas, getEntregaById, getEntregasAbertas, getEntregaByIdAPort, getEntregaByIdAFunc } from '../controllers/entregas.js'

const router = express.Router();

router.get('/', getEntregas);
router.get('/abertas/', getEntregasAbertas);
router.get('/:idEntrega', getEntregaById);
router.get('/:idEntrega/assinatura-funcionario', getEntregaByIdAFunc);
router.get('/:idEntrega/assinatura-porteiro', getEntregaByIdAPort);

export default router;