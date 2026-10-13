import { Router } from "express";
import { projetos } from "../data/dados";

const router = Router();

router.get("/projetos", (req, res) => {

    return res.status(200).json(projetos);

});

export default router;