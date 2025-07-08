import CrudRepository from './crud.repository.js';
import db from '../models/index.js';

const { User } = db;

class UserRepository extends CrudRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async findByToken(token) {
    return await User.findOne({ where: { verificationToken: token } });
  }
}

export default new UserRepository();
