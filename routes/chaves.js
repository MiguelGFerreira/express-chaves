import express from 'express';

import { getChaves, getChavesRestritas, postChave, patchChave, deleteChave, getChavesByArmario } from '../controllers/chaves.js'

const router = express.Router();

router.get('/', getChaves);
router.get('/:armario', getChavesByArmario);
router.get('/restritas/', getChavesRestritas);
router.post('/', postChave);
router.patch('/:idchave', patchChave);
router.delete('/:idchave', deleteChave);

export default router;