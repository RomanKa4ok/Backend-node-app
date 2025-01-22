import { Router } from 'express';
import ArticlesRepository from '../repositories/articles.repository';
const articlesRepository = new ArticlesRepository();

const articlesRouter = Router();

articlesRouter.get(
'/',
async (req, res) => {
    const article = await articlesRepository.findOneByOrFail({
        id: '8862239e-d50b-4a91-9f8a-31e997298811'
    })
    res.json(article);
}
)

export default articlesRouter;  