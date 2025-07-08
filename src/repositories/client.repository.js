import CrudRepository from './crud.repository.js';
import db from '../models/index.js';

const { Client } = db;

class ClientRepository extends CrudRepository {
  constructor() {
    super(Client);
  }

  async getFilteredClients(filter = {}, sort = []) {
    return await Client.findAll({
      where: filter,
      order: sort
    });
  }
}

export default new ClientRepository();
