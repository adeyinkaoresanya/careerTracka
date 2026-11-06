import { Router } from 'express';
import * as achievementController from '../controllers/achievement.controller';
import { authenticate } from '../middleware';
import { validate } from '../middleware/validate';
import {
  achievementIdSchema,
  achievementListSchema,
  achievementUpdateSchema,
} from '../validators/achievement.validator';

const router = Router();
router.use(authenticate);

/**
 * @swagger
 * /achievements:
 *   get:
 *     summary: Get the user portfolio of achievements
 *     tags: [Achievements]
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
 *           enum: [draft, approved, rejected]
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, status, jobRole]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Achievement list returned
 *       401:
 *         description: Authentication required
 */
router.get('/', validate(achievementListSchema), achievementController.listAchievements);

/**
 * @swagger
 * /achievements/{id}:
 *   get:
 *     summary: Get one achievement
 *     tags: [Achievements]
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
 *         description: Achievement returned
 *       404:
 *         description: Achievement not found
 *       401:
 *         description: Authentication required
 */
router.get('/:id', validate(achievementIdSchema), achievementController.getAchievement);

/**
 * @swagger
 * /achievements/{id}:
 *   patch:
 *     summary: Edit or approve an achievement
 *     tags: [Achievements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statement:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [draft, approved, rejected]
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Achievement updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Achievement not found
 *       401:
 *         description: Authentication required
 */
router.patch('/:id', validate(achievementIdSchema), validate(achievementUpdateSchema), achievementController.updateAchievement);

/**
 * @swagger
 * /achievements/{id}:
 *   delete:
 *     summary: Archive an achievement
 *     tags: [Achievements]
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
 *         description: Achievement archived successfully
 *       404:
 *         description: Achievement not found
 *       401:
 *         description: Authentication required
 */
router.delete('/:id', validate(achievementIdSchema), achievementController.archiveAchievement);

export default router;
