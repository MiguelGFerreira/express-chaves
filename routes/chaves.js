import express from 'express';

import { getChaves, postChave, patchChave, deleteChave } from '../controllers/chaves.js'

const router = express.Router();

router.get('/', getChaves);
router.post('/', postChave);
router.patch('/:idchave', patchChave);
router.delete('/:idchave', deleteChave);

export default router;