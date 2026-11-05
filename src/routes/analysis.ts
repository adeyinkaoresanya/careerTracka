import { Router } from 'express';
import * as analysisController from '../controllers/analysis.controller';
import { authenticate } from '../middleware';

const router = Router();
router.use(authenticate);

router.post(
  '/entries/:id/analyse',
  analysisController.analyseEntry
);

export default router;