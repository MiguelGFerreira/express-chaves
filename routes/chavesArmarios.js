import express from 'express';

import { getChavesArmarios, postChaveArmario, patchChaveArmario, deleteChaveArmario, } from '../controllers/chavesArmarios.js'

const router = express.Router();

router.get('/', getChavesArmarios);
router.post('/', postChaveArmario);
router.patch('/:armario', patchChaveArmario);
router.delete('/:armario', deleteChaveArmario);

export default router;