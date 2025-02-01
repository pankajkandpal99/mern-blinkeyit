import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  addToCartItemController,
  deleteCartItemController,
  fetchCartItemsController,
  updateCartItemController,
} from "../controllers/cart.controller.js";

const route = Router();

route.post(`/create/:productId`, authMiddleware, addToCartItemController);
route.get(`/fetch`, authMiddleware, fetchCartItemsController);
route.put(`/update/:itemId`, authMiddleware, updateCartItemController);
route.delete(`/delete/:itemId`, authMiddleware, deleteCartItemController);

export default route;
