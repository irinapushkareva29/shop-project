import { Router, Request, Response } from "express";
import { IAuthRequisites } from "@Shared/types";
import { IUserRequisitesEntity } from "../../types";
import { connection } from "../../index";


export const authRouter = Router();

authRouter.post('/', async (
    req: Request<{}, {}, IAuthRequisites>,
    res: Response
) => {
    const { username, password } = req.body;
    const [data] = await connection.query < IUserRequisitesEntity[] > (
        "SELECT * FROM users WHERE username = ? AND password = ?",
        [username, password]
    );

    if (!data?.length) {
        res.status(404);
    }

    res.send();
});