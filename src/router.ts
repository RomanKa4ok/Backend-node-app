import { Router } from 'express';
import articlesRouter from './plugins/articles/api/articles.router';

const router = Router();

router.use(
'/articles',
articlesRouter
);

export default router; 