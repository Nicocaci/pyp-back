import UserDao from '../dao/user.dao.js'

class UserRepository {
    async createUser(data) {
        return await UserDao.createUser(data);
    }
    async getUsers() {
        return await UserDao.getUsers();
    }
    async getUserById(uid){
        return await UserDao.getUserById(uid);
    }
    async getUserByEmail(email){
        return await UserDao.getUserByEmail(email);
    }
    async updateUser(uid, data) {
        return await UserDao.updateUser(uid, data);
    }
    async deleteUser(uid){
        return await UserDao.deleteUser(uid);
    }
}

export default new UserRepository();