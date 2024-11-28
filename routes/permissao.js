import express from 'express';

import { deletePermissao, getFuncionarios, getPermissao, getPermissaoPorChave, postPermissao } from '../controllers/permissao.js'

const router = express.Router();

router.get('/', getPermissao);
router.get('/:armario/:numero', getPermissaoPorChave);
router.get('/funcionarios/', getFuncionarios);
router.post('/', postPermissao);
router.delete('/:matricula/:idchave', deletePermissao);

export default router;