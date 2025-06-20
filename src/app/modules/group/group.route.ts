import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { GroupValidation } from './group.validation';
import { GroupController } from './group.controller';
import auth from '../../middlewares/auth.middleware';
import { upload } from '../../middlewares/multer.middleware';

const router = express.Router();

router.post(
  '/create-group',
  // validateRequest(GroupValidation.createGroupZodSchema),
  auth(),
  upload.single('image'),
  GroupController.createGroup
);

router.get('/my-groups', auth(), GroupController.getAllMyGroups);
router.get('/', auth(), GroupController.getAllGroups);
router.get('/:id', auth(), GroupController.getSingleGroup);
router.patch(
  '/:id',
  // validateRequest(GroupValidation.updateGroupZodSchema),
  auth(),
  upload.single('image'),
  GroupController.updateGroup
);
router.delete('/:id', auth(), GroupController.deleteGroup);
export const GroupRoutes = router;
