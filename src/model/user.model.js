import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true},
    apellido: { type: String, required: true},
    dni: { type: String, require:true, unique: true },
    direccion: { type: String, require:true },
    email: { type: String, require:true, unique: true },
    password: { type: String, require:true },
    rol: { type: String, enum: ["admin", "user"], default: "user"},
    cart: { type: mongoose.Schema.Types.ObjectId, ref:"carts"},
    orders: { type: mongoose.Schema.Types.ObjectId, ref: 'orders'}
})

const UserModel = mongoose.model('usuarios', userSchema);
export default UserModel;