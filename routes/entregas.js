import express from 'express';

import { getEntregas, getEntregaById, getEntregasAbertas, getEntregaByIdAPort, getEntregaByIdAFunc, getEntregaByIdAFuncDev, getEntregaByIdAPortDev, postEntrega, devolveEntrega } from '../controllers/entregas.js'

const router = express.Router();

router.get('/', getEntregas);
router.get('/abertas/', getEntregasAbertas);
router.get('/:idEntrega', getEntregaById);
router.get('/:idEntrega/assinatura-funcionario', getEntregaByIdAFunc);
router.get('/:idEntrega/assinatura-porteiro', getEntregaByIdAPort);
router.get('/:idEntrega/assinatura-funcionario-dev', getEntregaByIdAFuncDev);
router.get('/:idEntrega/assinatura-porteiro-dev', getEntregaByIdAPortDev);
router.post('/', postEntrega)
router.patch('/:idEntrega', devolveEntrega)

export default router;