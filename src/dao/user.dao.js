import UserModel from "../model/user.model.js";

class UserDao {
    async createUser(data){
        try {
            const newUser = await UserModel.create(data);
            return newUser;
        } catch (error) {
            throw error;
        }
    }
    async getUsers() {
        try {
            const usuarios = await UserModel.finf();
            return usuarios;
        } catch (error) {
            throw error;
        }
    }
    async getUserById(uid) {
        try {
            const usuario = await UserModel.findById(uid);
            return usuario;
        } catch (error) {
            throw error;
        }
    }
    async getUserByEmail(email) {
        try {
            const usuario = await UserModel({ email });
            return usuario;
        } catch (error) {
            throw error;
        }
    }
    async updateUser(uid, data) {
        try {
            const usuarioActualizado = await UserModel.findByIdAndUpdate(uid, data, {new:true});
            return usuarioActualizado;
        } catch (error) {
            throw error;   
        }
    }
    async deleteUser(uid) {
        try {
            const usuarioEliminado = await UserModel.findByIdAndDelete(uid);
            return usuarioEliminado;
        } catch (error) {
            throw error;
        }
    }
}
export default new UserDao();