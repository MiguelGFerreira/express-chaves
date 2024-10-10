import express from 'express';

import { getChaves, getChavesRestritas, postChave, patchChave, deleteChave } from '../controllers/chaves.js'

const router = express.Router();

router.get('/', getChaves);
router.get('/restritas/', getChavesRestritas);
router.post('/', postChave);
router.patch('/:idchave', patchChave);
router.delete('/:idchave', deleteChave);

export default router;