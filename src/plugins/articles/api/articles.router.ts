import {Router} from "express";

const articlesRouter = Router();

articlesRouter.get('/', async (req, res) => {
    res.send('articles here');
})

export default articlesRouter;