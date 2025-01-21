import {Router} from "express";
import { pgdb } from "src/db/typeorm";
import {Articles} from "src/db/entities";

const articlesRouter = Router();

articlesRouter.get('/', async (req, res) => {
    const data = await pgdb.getRepository(Articles).findOneBy({ id : '8862239e-d50b-4a91-9f8a-31e997298811'})

    res.json(data);
})

export default articlesRouter;