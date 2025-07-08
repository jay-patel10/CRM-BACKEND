import ClientRepository from '../repositories/client.repository.js';
import AppError from '../utils/errors/app-error.js';
import { StatusCodes } from 'http-status-codes';
import { Op } from 'sequelize';
import {
  DEPARTMENT_TYPES,
  CLIENT_STATUSES,
  CHECKLIST_STATUSES
} from '../utils/index.js';



export const createClientService = async (data, file) => {
  const { sfId, name, departmentType, email } = data;

  // 1. Required field validation
  if (!sfId || !name || !departmentType || !email) {
    throw new AppError(
      'SF ID, Client Name, Department Type, and Email are required',
      StatusCodes.BAD_REQUEST
    );
  }

  // 2. Validate department type against allowed values
  if (!DEPARTMENT_TYPES.includes(departmentType)) {
    throw new AppError(
      `Invalid department type. Allowed values: ${DEPARTMENT_TYPES.join(', ')}`,
      StatusCodes.BAD_REQUEST
    );
  }

  // 3. Handle logo upload
  const logo = file ? file.path : null;

  // 4. Create client
  const client = await ClientRepository.create({
    sfId,
    name,
    departmentType,
    email,
    logo,
    ...data
  });

  return client;
};

export const getAllClientsService = async (query = {}) => {
  let customFilter = {};
  let sortFilter = [];

  // Filter: departmentType
  if (query.departmentType) {
    const value = query.departmentType.trim();
    if (DEPARTMENT_TYPES.includes(value)) {
      customFilter.departmentType = value;
    } else {
      throw new AppError(
        `Invalid departmentType: ${value}. Must be one of: ${DEPARTMENT_TYPES.join(', ')}`,
        StatusCodes.BAD_REQUEST
      );
    }
  }

  // ✅ Filter: checklistStatus with partial match (e.g. 'Pending%')
  if (query.checklistStatus) {
    const value = query.checklistStatus.trim();
    if (CHECKLIST_STATUSES.includes(value)) {
      customFilter.checklistStatus = {
        [Op.like]: `${value}%`
      };
    } else {
      throw new AppError(
        `Invalid checklistStatus: ${value}. Must be one of: ${CHECKLIST_STATUSES.join(', ')}`,
        StatusCodes.BAD_REQUEST
      );
    }
  }

  // Filter: status
  if (query.status) {
    const value = query.status.trim();
    if (CLIENT_STATUSES.includes(value)) {
      customFilter.status = value;
    } else {
      throw new AppError(
        `Invalid status: ${value}. Must be one of: ${CLIENT_STATUSES.join(', ')}`,
        StatusCodes.BAD_REQUEST
      );
    }
  }

  // Optional sort
  if (query.sort) {
    const sortParams = query.sort.split(',');
    sortFilter = sortParams
      .map((param) => param.split('_'))
      .filter(([key, order]) => key && order);
  }

  const clients = await ClientRepository.getFilteredClients(customFilter, sortFilter);
  return clients;
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
