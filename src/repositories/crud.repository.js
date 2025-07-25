import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/index.js';

class CrudRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    const response = await this.model.create(data);
    return response;
  }

  async destroy(id) {
    const response = await this.model.destroy({ where: { id } });

    if (!response) {
      throw new AppError('Resource not found', StatusCodes.NOT_FOUND);
    }

    return response;
  }

  async get(id) {
    const response = await this.model.findByPk(id);

    if (!response) {
      throw new AppError('Resource not found', StatusCodes.NOT_FOUND);
    }

    return response;
  }

  async getAll() {
    const response = await this.model.findAll();
    return response;
  }

  async update(id, data) {
    const response = await this.model.update(data, {
      where: { id }
    });

    return response;
  }
}

export default CrudRepository;
