import express from 'express';

import { getArmarios, getArmariosDet, patchArmario } from '../controllers/armarios.js'

const router = express.Router();

router.get('/', getArmarios);
router.get('/det/', getArmariosDet);
router.patch('/:id', patchArmario);

export default router;