import express from 'express';

import { getArmarios } from '../controllers/armarios.js'

const router = express.Router();

router.get('/', getArmarios);

export default router;