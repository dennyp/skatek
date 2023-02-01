import express from 'express'
import { productController } from '../controllers/productController.js'

export const router = express.Router()

const controller = new productController()

router.get('/', (req, res, next) => controller.findAll(req, res, next))
