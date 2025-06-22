import express from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth.middleware';
import { UserValidation } from './user.validation';
import { upload } from '../../middlewares/multer.middleware';

const router = express.Router();

router.post(
  '/create-user',
  // validateRequest(UserValidation.createUserZodSchema),
  auth(),
  upload.single('profileImage'),
  UserController.createdUser
);
router.get('/', auth(), UserController.getAllUsers);
router.get('/my-profile', auth(), UserController.getMyProfile);
router.get('/my-users', auth(), UserController.getAllMyUsers);
router.get('/:id', auth(), UserController.getSingleUser);
router.patch(
  '/:id',
  validateRequest(UserValidation.updateUserZodSchema),
  auth(),
  upload.single('profileImage'),
  UserController.updateUser
);
router.delete('/:id', auth(), UserController.deleteUser);

export const UserRoutes = router;
