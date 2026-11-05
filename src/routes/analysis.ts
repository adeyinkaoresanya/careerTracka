import { Router } from 'express';
import * as analysisController from '../controllers/analysis.controller';
import { authenticate } from '../middleware';
import { validate } from '../middleware/validate';
import { analysisEntryParamsSchema } from '../validators/analysis.validator';

const router = Router();
router.use(authenticate);

/**
 * @swagger
 * /work/entries/{id}/analyses:
 *   get:
 *     summary: View analysis history for a work entry
 *     tags: [Analysis]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Analysis history returned
 *       404:
 *         description: Work entry not found
 *       401:
 *         description: Authentication required
 */
router.get(
  '/entries/:id/analyses',
  validate(analysisEntryParamsSchema),
  analysisController.listAnalyses
);

/**
 * @swagger
 * /work/entries/{id}/analyse:
 *   post:
 *     summary: Analyse a work entry with AI
 *     tags: [Analysis]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Entry analysed successfully
 *       404:
 *         description: Work entry not found
 *       401:
 *         description: Authentication required
 */
router.post(
  '/entries/:id/analyse',
  validate(analysisEntryParamsSchema),
  analysisController.analyseEntry
);

export default router;