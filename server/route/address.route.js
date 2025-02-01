import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createAddressController,
  deleteAddressController,
  fetchAddressController,
  updateAddressController,
} from "../controllers/address.controller.js";

const route = Router();

route.post("/create", authMiddleware, createAddressController);
route.get("/fetch", authMiddleware, fetchAddressController);
route.put("/update/:addressId", authMiddleware, updateAddressController);
route.delete("/delete/:addressId", authMiddleware, deleteAddressController);

export default route;
