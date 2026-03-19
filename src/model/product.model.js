import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    sku: { type: String, required: true },
    nombre: { type: String, required: true },
    imagen: { type: String },
    descripcion: { type: String, required: true },
    categoria: { type: String, required: true },
    precio: { type: Number, required: true },
    stock: { type: Number, required: true },
    estado: { type: Boolean, required: true },
    destacado: { type: Boolean, required: true }
})

const ProductModel = mongoose.model('products', productSchema);

export default ProductModel;