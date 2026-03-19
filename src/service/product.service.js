import ProductRepository from "../repository/product.repository.js";
import ProductModel from "../model/product.model.js";

class ProductService {
      async createProduct(data) {
    return await ProductRepository.createProduct(data);
  }
  async getProducts(filtros) {
    return await ProductRepository.getProducts(filtros);
  }
  async getProductBySku(sku) {
    return await ProductRepository.getProductBySku(sku);
  }
  async getProductById(pid) {
    return await ProductRepository.getProductById(pid);
  }
  async getProductByCategory(categoria, page, limit) {
    return await ProductRepository.getProductByCategory(categoria, page, limit);
  }
  async getProductBySubCategory(subcategoria, page, limit) {
    return await ProductRepository.getProductBySubCategory(
      subcategoria,
      page,
      limit,
    );
  }
  async updateProduct(pid, data) {
    return await ProductRepository.updateProduct(pid, data);
  }
  async deleteProduct(pid) {
    return await ProductRepository.deleteProduct(pid);
  }
  async getDistinctCategories() {
    return await ProductModel.distinct("categoria");
  }
  async getDistinctSubcategoriesByCategory(categoria) {
    return await ProductRepository.getDistinctSubcategoriesByCategory(
      categoria,
    );
  }
  async getProductsWithFilters({ page, limit, filters, sort }) {
    const skip = (page - 1) * limit;

    let sortOptions = {};
    if (sort === "price_asc") sortOptions.price = 1;
    if (sort === "price_desc") sortOptions.price = -1;

    const products = await ProductModel.find(filters)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const total = await ProductModel.countDocuments(filters);

    return {
      products,
      pagination: {
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }
}

export default new ProductService();