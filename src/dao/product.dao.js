import ProductModel from "../model/product.model.js";

class ProductDao {
  async createProduct(data) {
    try {
      //Verificamos si el producto ya existe
      const existeProducto = await ProductModel.findOne({ sku: data.sku });
      if (existeProducto) {
        throw new Error(" El producto con ese código ya existe");
      }
      const nuevoProducto = await ProductModel.create(data);
      return nuevoProducto;
    } catch (error) {
      // Si es un error de MongoDB por duplicado (código 11000)
      if (error.code === 11000 || error.code === 11001) {
        throw new Error(`Ya existe un producto con el SKU: ${data.sku}`);
      }
      throw error;
    }
  }
  async getProducts(filtros) {
    try {
      const {
        page = 1,
        limit = 4,
        search,
        categoria,
        subcategoria,
        minPrice,
        maxPrice,
        sort,
      } = filtros;

      const skip = (page - 1) * limit;
      const query = {};

      if (search) {
        const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        query.nombre = { $regex: escaped, $options: "i" };
      }
      if (search) {
        const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        query.name = { $regex: escaped, $options: "i" };
      }

      if (categoria) query.categoria = categoria;
      if (subcategoria) query.subcategoria = subcategoria;

      if (minPrice || maxPrice) {
        query.precio = {};
        if (minPrice) query.precio.$gte = Number(minPrice);
        if (maxPrice) query.precio.$lte = Number(maxPrice);
      }

      let sortOption = {};
      if (sort === "price_asc") sortOption.precio = 1;
      if (sort === "price_desc") sortOption.precio = -1;

      const [products, total] = await Promise.all([
        ProductModel.find(query)
          .sort(sortOption)
          .skip(skip)
          .limit(Number(limit)),
        ProductModel.countDocuments(query),
      ]);

      const totalPages = Math.max(1, Math.ceil(total / limit));

      return {
        products: products || [],
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: total || 0,
          totalPages, // 👈 NUNCA 0
        },
      };
    } catch (error) {
      return {
        products: [],
        pagination: {
          page: 1,
          limit: 12,
          total: 0,
          totalPages: 1,
        },
      };
    }
  }
  async getProductById(pid) {
    try {
      const product = await ProductModel.findById(pid);
      return product;
    } catch (error) {
      throw error;
    }
  }
  async getProductBySku(sku) {
    try {
      const escapeRegex = (text) => {
        return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      };
      const cleanSku = String(sku || "").trim();
      if (!cleanSku) return null;
      // Si tu SKU es consistente en DB, preferir exact match:
      const product = await ProductModel.findOne({
        sku: { $regex: `^${escapeRegex(cleanSku)}$`, $options: "i" },
      }).lean();
      return product;
    } catch (error) {
      throw error;
    }
  }
  async getProductsByCategory(categoria, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const products = await ProductModel.find({ categoria })
        .skip(skip)
        .limit(parseInt(limit));
      const total = await ProductModel.countDocuments({ categoria });
      return {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }
  async getProductsBySubCategory(subcategoria, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const products = await ProductModel.find({ subcategoria })
        .skip(skip)
        .limit(parseInt(limit));
      const total = await ProductModel.countDocuments({ subcategoria });
      return {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }
  async updateProduct(pid, data) {
    try {
      const product = await ProductModel.findByIdAndUpdate(pid, data, {
        new: true,
      });
      if (!product) {
        throw new Error("Producto no encontrado");
      }
      return product;
    } catch (error) {
      throw error;
    }
  }
  async deleteProduct(pid) {
    try {
      const product = await ProductModel.findByIdAndDelete(pid);
      if (!product) {
        throw new Error("Producto no encontrado");
      }
      return product;
    } catch (error) {
      throw error;
    }
  }
  async getDistinctSubcategoriesByCategory(categoria) {
    try {
      const subcategories = await ProductModel.distinct("subcategoria", {
        categoria,
      });
      return subcategories;
    } catch (error) {
      throw error;
    }
  }
}

export default new ProductDao();
