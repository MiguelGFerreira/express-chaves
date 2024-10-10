import express from 'express';

import { deletePermissao, getFuncionarios, getPermissao, postPermissao } from '../controllers/permissao.js'

const router = express.Router();

router.get('/', getPermissao);
router.get('/funcionarios/', getFuncionarios);
router.post('/', postPermissao);
router.delete('/:matricula/:idchave', deletePermissao);

export default router;