import { Router } from 'express';
import * as workEntryController from '../controllers/workEntry.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware';
import { requirePermission } from '../middleware';
import { createEntrySchema, listEntriesSchema, entryParamsSchema } from '../validators/workEntry.validator';

const router = Router();
router.use(authenticate);

/**
 * @swagger
 * /work/entries:
 *   post:
 *     summary: Create a work entry
 *     tags: [Work Entries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [jobRole, jobContent, experienceLevel, industry, weekStart, weekEnd]
 *             properties:
 *               jobRole:
 *                 type: string
 *               jobContent:
 *                 type: string
 *               experienceLevel:
 *                 type: string
 *               industry:
 *                 type: string
 *               tools:
 *                 type: array
 *                 items:
 *                   type: string
 *               weekStart:
 *                 type: string
 *                 format: date
 *               weekEnd:
 *                 type: string
 *                 format: date
 *     responses:
 *       202:
 *         description: Work entry accepted and queued for AI analysis
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 */
router.post('/entries', requirePermission('entries:create'), validate(createEntrySchema), workEntryController.createEntry);

/**
 * @swagger
 * /work/entries:
 *   get:
 *     summary: List work entries
 *     tags: [Work Entries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, jobRole]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Work entries returned
 *       401:
 *         description: Authentication required
 */
router.get('/entries', requirePermission('entries:read'), validate(listEntriesSchema), workEntryController.listEntries);

/**
 * @swagger
 * /work/entries/{id}:
 *   get:
 *     summary: Get a work entry
 *     tags: [Work Entries]
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
 *         description: Work entry returned
 *       404:
 *         description: Work entry not found
 *       401:
 *         description: Authentication required
 */
router.get('/entries/:id', requirePermission('entries:read'), validate(entryParamsSchema), workEntryController.getEntry);

/**
 * @swagger
 * /work/entries/{id}:
 *   delete:
 *     summary: Delete a work entry
 *     tags: [Work Entries]
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
 *         description: Work entry deleted successfully
 *       404:
 *         description: Work entry not found
 *       401:
 *         description: Authentication required
 */
router.delete('/entries/:id', requirePermission('entries:delete'), validate(entryParamsSchema), workEntryController.deleteEntry);

export default router;