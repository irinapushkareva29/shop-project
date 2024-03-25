import { Router, Request, Response } from "express";
import { getProducts, searchProducts, getProduct, removeProduct, updateProduct } from "../models/products.model";
import { IProductFilterPayload } from "@Shared/types";
import { IProductEditData } from "../types";
import { throwServerError } from "../controllers/helper";

export const productsRouter = Router();

productsRouter.get('/', async (req: Request, res: Response) => {
    try {
        console.log('req', req.session);
        const products = await getProducts();
        res.render("products", {
            items: products,
            queryParams: {}
        });
    } catch (e) {
        throwServerError(res, e);
    }
});

productsRouter.get('/search', async (
    req: Request<{}, {}, {}, IProductFilterPayload>,
    res: Response
) => {
    try {
        const products = await searchProducts(req.query);
        res.render("products", {
            items: products,
            queryParams: req.query
        });
    } catch (e) {
        throwServerError(res, e);
    }
});

productsRouter.get('/:id', async (
    req: Request<{ id: string }>,
    res: Response
) => {
    try {
        const product = await getProduct(req.params.id);

        if (product) {
            res.render("product/product", {
                item: product
            });
        } else {
            res.render("product/empty-product", {
                id: req.params.id
            });
        }
    } catch (e) {
        throwServerError(res, e);
    }
});

productsRouter.get('/remove-product/:id', async (
    req: Request<{ id: string }>,
    res: Response
) => {
    try {
        await removeProduct(req.params.id);
        res.redirect(`/${process.env.ADMIN_PATH}`);
    } catch (e) {
        throwServerError(res, e);
    }
});

productsRouter.post('/save/:id', async (
    req: Request<{ id: string }, {}, IProductEditData>,
    res: Response
) => {
    const updatedProduct = await updateProduct(req.params.id, req.body);
    res.send("OK");
});