/**
 * Main entry point for the /api/ routes.
 * @file Index Routes
 * @module Index Routes
 * @category routes
 */


import { Router } from 'express';
import hallRoutes from './hall.route.js';
import authRoutes from './auth.route.js';


const router = Router();

/*
* Route registration
*/
router.use('/hall', hallRoutes);
router.use('/auth', authRoutes);


export default router;