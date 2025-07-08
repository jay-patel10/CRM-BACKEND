import express from 'express';
import {
  getAllClients,
  createClient,
  updateClient,
  deleteClient,
  getClientById
} from '../controllers/index.js';

const router = express.Router();

router.get('/', getAllClients);
router.post('/', createClient);
router.patch('/:id', updateClient);
router.delete('/:id', deleteClient);
router.get('/:id', getClientById);

export default router;
