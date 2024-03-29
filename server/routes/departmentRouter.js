import express from 'express'
import { departmentController } from '../controllers/departmentController.js'
import { verifyToken } from '../middleware/auth.js'

export const router = express.Router()

const controller = new departmentController()

router.get('/', verifyToken, (req, res, next) =>
  controller.findAll(req, res, next)
)
router.get('/:id', verifyToken, (req, res, next) =>
  controller.find(req, res, next)
)
router.post('/', verifyToken, (req, res, next) =>
  controller.create(req, res, next)
)
