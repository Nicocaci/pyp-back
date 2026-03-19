import ProductService from "../service/product.service.js";
import ProductModel from "../model/product.model.js";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

// Función auxiliar fuera de la clase para no depender de `this`
const deleteImageFromDisk = (imageName) => {
  const rutaCompleta = path.join("uploads", imageName);
  if (fs.existsSync(rutaCompleta)) {
    try {
      fs.unlinkSync(rutaCompleta);
    } catch (error) {
      console.error("Error al borrar imagen:", rutaCompleta, error);
    }
  }
};

class ProductController {
  async createProduct(req, res) {
    try {
      const {
        sku,
        nombre,
        descripcion,
        categoria,
        subcategoria,
        precio,
        stock,
        estado,
        destacado
      } = req.body;

      // let imagenes = [];

      // if (req.files && req.files.length > 0) {
      //   imagenes = req.files.map((f) => f.filename);
      // }

      // ❌ validaciones
      if (!nombre || !descripcion || !categoria || !precio) {
        return res.status(400).json({
          message: "Faltan campos requeridos",
        });
      }

      const newProduct = await ProductService.createProduct({
        sku,
        nombre,
        // imagen: imagenes,
        descripcion,
        categoria,
        subcategoria,
        precio,
        stock,
        estado,
        destacado
      });

      return res.status(201).json({
        message: "Producto Creado",
        newProduct,
      });
    } catch (error) {
      if (error.message?.includes("Código de producto duplicado")) {
        return res.status(409).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: "Error al crear producto",
        error: error.message,
      });
    }
  }
  async updateProduct(req, res) {
    const pid = req.params.pid;

    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    try {
      const product = await ProductService.getProductById(pid);

      if (!product) {
        return res.status(404).json({ message: "No existe el producto" });
      }

      const nuevasImagenes = req.files?.map((file) => file.filename) || [];

      const data = {
        ...req.body,
        precio: req.body.precio ? Number(req.body.precio) : undefined,
        stock: req.body.stock ? Number(req.body.stock) : undefined,
      };

      // 🚫 nunca permitir imagen desde body
      delete data.imagen;

      if (nuevasImagenes.length > 0) {
        if (Array.isArray(product.imagen)) {
          product.imagen.forEach((img) => deleteImageFromDisk(img));
        }
        data.imagen = nuevasImagenes;
      }

      const updatedProduct = await ProductService.updateProduct(pid, data);

      return res.status(200).json({
        message: "Producto actualizado",
        product: updatedProduct,
      });
    } catch (error) {
      console.error("UPDATE ERROR:", error);
      return res.status(500).json({
        message: "Error al actualizar",
        error: error.message,
      });
    }
  }

  async deleteProduct(req, res) {
    const pid = req.params.pid;
    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    try {
      const product = await ProductService.getProductById(pid);
      if (!product) {
        return res.status(404).json({
          message: "Producto no encontrado",
        });
      }
      // Borrar todas las imágenes del array (usamos la función auxiliar, no `this`)
      if (product.imagen && Array.isArray(product.imagen)) {
        product.imagen.forEach((img) => deleteImageFromDisk(img));
      }

      await ProductService.deleteProduct(pid);

      return res.status(200).json({
        message: "Producto eliminado",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Error al eliminar producto",
        error: error.message,
      });
    }
  }
  async getProducts(req, res) {
    try {
      const {
        page = 1,
        limit = 6,
        search,
        category,
        subcategory,
        sort,
      } = req.query;

      const result = await ProductService.getProducts({
        page: Number(page),
        limit: Number(limit),
        search,
        category,
        subcategory,
        sort,
      });

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        message: "Error al obtener productos",
        error: error.message,
      });
    }
  }

  async getCategories(req, res) {
    try {
      const categories = await ProductService.getDistinctCategories();
      return res.status(200).json(categories);
    } catch (error) {
      return res.status(500).json({
        message: "Error al obtener categorías",
        error: error.message,
      });
    }
  }
  async getProductBySku(req, res) {
    const sku = (req.params.sku || "").trim();
    if (!sku)
      return res.status(400).json({
        message: "Producto no encontrado",
      });
    try {
      const product = await ProductService.getProductBySku(sku);
      if (!product)
        return res.status(404).json({ message: "Producto no encontrado" });
      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json({
        message: "Error al obtener producto por SKU",
        error: err.message,
      });
    }
  }
  async getProductById(req, res) {
    const pid = req.params.pid;
    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    try {
      const product = await ProductService.getProductById(pid);
      if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json({
        message: "Error al obtener el producto",
        error: error.message,
      });
    }
  }
  async getSubcategoriesByCategory(req, res) {
    try {
      const { category } = req.params;

      const subcategories = await ProductModel.distinct("subcategoria", {
        categoria: category,
      });

      return res.status(200).json(subcategories);
    } catch (error) {
      return res.status(500).json({
        message: "Error al obtener subcategorías",
        error: error.message,
      });
    }
  }
}

export default new ProductController();