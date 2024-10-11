import express from 'express';

import { getArmarios, getArmariosDet, getMovimentacoes, patchArmario } from '../controllers/armarios.js'

const router = express.Router();

router.get('/', getArmarios);
router.get('/det/', getArmariosDet);
router.get('/movimentacoes/', getMovimentacoes);
router.patch('/:id', patchArmario);

export default router;