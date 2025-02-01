import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createOnlinePaymentSessionController,
  createOrderCODController,
  fetchOrderByUserIdController,
} from "../controllers/order.controller.js";

const route = Router();

route.post(`/create/cod`, authMiddleware, createOrderCODController);
route.post(
  `/create/checkout-online`,
  authMiddleware,
  createOnlinePaymentSessionController
);
route.get(`/fetch`, authMiddleware, fetchOrderByUserIdController);

export default route;
