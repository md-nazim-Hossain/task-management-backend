import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryValidation } from './category.validation';
import { CategoryController } from './category.controller';
import auth from '../../middlewares/auth.middleware';

const router = express.Router();

router.post(
  '/create-category',
  validateRequest(CategoryValidation.createCategoryZodSchema),
  auth(),
  CategoryController.createCategory
);
router.get('/', auth(), CategoryController.getAllCategories);
router.patch(
  '/:id',
  validateRequest(CategoryValidation.updateCategoryZodSchema),
  auth(),
  CategoryController.updateCategory
);
router.delete('/:id', auth(), CategoryController.deleteCategory);

export const CategoryRoutes = router;
