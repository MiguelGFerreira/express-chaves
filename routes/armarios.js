import express from 'express';

import { getArmarios, getArmariosDet, getArmariosOcupados, getAssinaturaArmario, getAssinaturaMovimentacao, getEmprestimosSemAssinatura, getMovimentacoes, getSegundaViaEmAberto, patchArmario, patchMovimentacaoArmario, postMovimentacaoSegundaVia } from '../controllers/armarios.js'

const router = express.Router();

router.get('/', getArmarios);
router.get('/det/', getArmariosDet);
router.get('/ocupados/', getArmariosOcupados);
router.get('/movimentacoes/', getMovimentacoes);
router.get('/emprestimos/', getEmprestimosSemAssinatura);
router.get('/:idMov/assinatura', getAssinaturaMovimentacao);
router.get('/:idArmario/:matricula', getAssinaturaArmario);
router.patch('/:id', patchArmario);
router.patch('/assinatura/:idMovimentacao', patchMovimentacaoArmario)
router.post('/segundaVia/', postMovimentacaoSegundaVia)
router.get('/segundaVia/', getSegundaViaEmAberto)


export default router;