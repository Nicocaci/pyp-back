import UserRepository from "../repository/user.repository.js";

class UserService {
        async createUser(data) {
            return await UserRepository.createUser(data);
        }
        async getUsers() {
            return await UserRepository.getUsers();
        }
        async getUserById(uid){
            return await UserRepository.getUserById(uid);
        }
        async getUserByEmail(email){
            return await UserRepository.getUserByEmail(email);
        }
        async updateUser(uid, data) {
            return await UserRepository.updateUser(uid, data);
        }
        async deleteUser(uid){
            return await UserRepository.deleteUser(uid);
        }
}

export default new UserService();