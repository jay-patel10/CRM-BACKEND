import ClientRepository from '../repositories/client.repository.js';
import AppError from '../utils/errors/app-error.js';
import { StatusCodes } from 'http-status-codes';

export const createClientService = async (data) => {
  const client = await ClientRepository.create(data);
  return client;
};

export const getAllClientsService = async () => {
  return await ClientRepository.getAll();
};

export const getClientByIdService = async (id) => {
  const client = await ClientRepository.get(id);
  return client;
};

export const updateClientService = async (id, data) => {
  const updated = await ClientRepository.update(id, data);
  return updated;
};

export const deleteClientService = async (id) => {
  const deleted = await ClientRepository.destroy(id);
  return deleted;
};
