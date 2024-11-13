import express from 'express';

import { getArmarios, getArmariosDet, getAssinaturaArmario, getAssinaturaMovimentacao, getMovimentacoes, patchArmario } from '../controllers/armarios.js'

const router = express.Router();

router.get('/', getArmarios);
router.get('/det/', getArmariosDet);
router.get('/movimentacoes/', getMovimentacoes);
router.get('/:idMov/assinatura', getAssinaturaMovimentacao);
router.get('/:idArmario/:matricula', getAssinaturaArmario);
router.patch('/:id', patchArmario);

export default router;