import { StatusCodes } from 'http-status-codes';
import {
  createClientService,
  getAllClientsService,
  getClientByIdService,
  updateClientService,
  deleteClientService
} from '../services/client.service.js';
import { SuccessResponse, ErrorResponse } from '../utils/index.js';


export const createClient = async (req, res) => {
  try {
    const client = await createClientService(req.body, req.file); // 👈 include file
    SuccessResponse.message = 'Client created successfully';
    SuccessResponse.data = client;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = error.message || 'Failed to create client';
    ErrorResponse.error = {
      statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      explanation: error.explanation || error.message || 'Internal error'
    };
    return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
};

export const getAllClients = async (req, res) => {
  try {
    const clients = await getAllClientsService(req.query); // ✅ Pass query params
    SuccessResponse.data = clients;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
};

export const getClientById = async (req, res) => {
  try {
    const client = await getClientByIdService(req.params.id);
    SuccessResponse.data = client;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
};

export const updateClient = async (req, res) => {
  try {
    const client = await updateClientService(req.params.id, req.body);
    SuccessResponse.data = client;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
};

export const deleteClient = async (req, res) => {
  try {
    const result = await deleteClientService(req.params.id);
    SuccessResponse.data = result;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
};
