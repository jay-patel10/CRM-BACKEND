import express from 'express';
import {
  getAllClients,
  createClient,
  updateClient,
  deleteClient,
  getClientById
} from '../controllers/index.js';
import upload from '../config/multer.js';


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Client Management APIs
 */

/**
 * @swagger
 * /clients:
 *   get:
 *     summary: Get all clients (with optional filters)
 *     tags: [Clients]
 *     parameters:
 *       - in: query
 *         name: departmentType
 *         schema:
 *           type: string
 *         description: Filter by department type
 *       - in: query
 *         name: checklistStatus
 *         schema:
 *           type: string
 *         description: Filter by checklist status (partial match supported)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by client status
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Comma-separated sort fields (e.g. "createdAt_desc,name_asc")
 *     responses:
 *       200:
 *         description: List of clients
 */
router.get('/', getAllClients);

/**
 * @swagger
 * /clients:
 *   post:
 *     summary: Create a new client
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - sfId
 *               - name
 *               - departmentType
 *               - email
 *             properties:
 *               sfId:
 *                 type: string
 *                 example: SF004
 *               name:
 *                 type: string
 *                 example: Company F1
 *               departmentType:
 *                 type: string
 *                 enum: [Aggregator OB, SMBs, Auto care, White Label]
 *                 example: White Label
 *               email:
 *                 type: string
 *                 example: support@companyf1.com
 *               checklistStatus:
 *                 type: string
 *                 example: Pending (10%)
 *               status:
 *                 type: string
 *                 example: Inactive
 *               createdBy:
 *                 type: integer
 *                 example: 2
 *               notes:
 *                 type: string
 *                 example: High-value F1 client
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Client created
 */
router.post('/', upload.single('logo'), createClient);

/**
 * @swagger
 * /clients/{id}:
 *   patch:
 *     summary: Update client details
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Client ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               departmentType:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Client updated
 */
router.patch('/:id', updateClient);

/**
 * @swagger
 * /clients/{id}:
 *   delete:
 *     summary: Delete a client
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Client ID
 *     responses:
 *       200:
 *         description: Client deleted
 */
router.delete('/:id', deleteClient);

/**
 * @swagger
 * /clients/{id}:
 *   get:
 *     summary: Get a single client by ID
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Client ID
 *     responses:
 *       200:
 *         description: Client details
 */
router.get('/:id', getClientById);

export default router;
