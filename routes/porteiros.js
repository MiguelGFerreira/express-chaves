import express from 'express';

import { getPorteirosAtivos } from '../controllers/porteiros.js'

const router = express.Router();

router.get('/', getPorteirosAtivos);

export default router;