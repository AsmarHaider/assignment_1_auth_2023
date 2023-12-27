// src/routes/authRoutes.ts
import express from 'express';
import { apiKeyMiddleware, jwtMiddleware } from '../middleware/authMiddleware';
import {securityMiddleware} from "../middleware/securityMiddleware";
import {RoleServiceController} from "../controllers/RoleServiceController";

const router = express.Router();

router.get('/roles', securityMiddleware, apiKeyMiddleware, jwtMiddleware, RoleServiceController.getRoles);
router.get('/permissions', securityMiddleware, apiKeyMiddleware, jwtMiddleware, RoleServiceController.getPermissions);
router.put('/roles', securityMiddleware, apiKeyMiddleware, jwtMiddleware, RoleServiceController.setPermissionForARole);


export default router;