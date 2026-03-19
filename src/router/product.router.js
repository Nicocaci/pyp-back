import ProductController from "../controller/product.controller.js";
import express from "express";
import upload from "../config/multerConfig.js";

const router = express.Router();
router.post("/", upload.array("imagen", 10), ProductController.createProduct);

// 👇 ESTE ES EL IMPORTANTE
router.get("/", ProductController.getProducts);

// 👇 NUEVA RUTA
router.get("/categories", ProductController.getCategories);
router.get(
  "/subcategories/:category",
  ProductController.getSubcategoriesByCategory
);

router.get("/sku/:sku", ProductController.getProductBySku);
router.get("/:pid", ProductController.getProductById);
router.put(
  "/:pid",
  upload.array("imagen", 10),
  ProductController.updateProduct,
);
router.delete("/:pid", ProductController.deleteProduct);

export default router;
