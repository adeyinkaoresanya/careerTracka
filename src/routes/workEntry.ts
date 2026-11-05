import { Router } from 'express';
import * as workEntryController from '../controllers/workEntry.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware';
import { requirePermission } from '../middleware';
import { createEntrySchema, listEntriesSchema, entryParamsSchema } from '../validators/workEntry.validator';

const router = Router();
router.use(authenticate);

router.post('/entries', requirePermission('entries:create'), validate(createEntrySchema), workEntryController.createEntry);
router.get('/entries', requirePermission('entries:read'), validate(listEntriesSchema), workEntryController.listEntries);
router.get('/entries/:id', requirePermission('entries:read'), validate(entryParamsSchema), workEntryController.getEntry);
router.delete('/entries/:id', requirePermission('entries:delete'), validate(entryParamsSchema), workEntryController.deleteEntry);

export default router;