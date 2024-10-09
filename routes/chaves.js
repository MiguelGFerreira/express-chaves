import express from 'express';

import { getChaves, postChave, patchChave, deleteChave } from '../controllers/chaves.js'

const router = express.Router();

router.get('/', getChaves);
router.post('/', postChave);
router.patch('/armario/:armario/numero/:numero', patchChave);
router.delete('/armario/:armario/numero/:numero', deleteChave);

export default router;