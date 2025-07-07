import CrudRepository from './crud.repository.js';
import db from '../models/index.js';

const { Client } = db;

class ClientRepository extends CrudRepository {
  constructor() {
    super(Client);
  }

  // Add custom queries if needed later (e.g. filter, pagination)
}

export default new ClientRepository();
