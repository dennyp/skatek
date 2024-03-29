import { getMonth } from 'date-fns'
import createError from 'http-errors'
import mongoose from 'mongoose'
import { LightTrapLog } from '../models/LightTrapLog.js'
import { Product } from '../models/Product.js'
import {
  getLightTrapLogPlotData,
  getPlottableData,
} from '../visual/plotData.js'

export class lightTrapLogController {
  async findOne(req, res, next) {
    try {
      const { id } = req.params
      const lightTrapLog = await LightTrapLog.getById(id)

      if (!lightTrapLog) {
        next(createError(404))
      }

      res.json(lightTrapLog)
    } catch (error) {
      next(createError(500))
    }
  }

  async findAll(req, res, next) {
    try {
      const { page = 1, pageSize = 20, sort = null, search = '' } = req.query

      const generateSort = () => {
        const sortParsed = JSON.parse(sort)
        const sortFormatted = {
          [sortParsed.field]: sortParsed.sort === 'asc' ? 1 : -1,
        }
        return sortFormatted
      }

      const sortFormatted = Boolean(sort) ? generateSort() : {}

      const lightTrapLogs = await LightTrapLog.getAll(
        sortFormatted,
        page,
        pageSize
      )

      const total = await LightTrapLog.countDocuments()

      res.json({ lightTrapLogs, total })
    } catch (error) {
      next(createError(500))
    }
  }

  async findAllVisualPerInsect(req, res, next) {
    try {
      const { department, dateStart, dateEnd } = req.query

      const products = await Product.getByDepartment(department)
      const productsIds = products.map((product) => product._id)

      const { readyToPlotProducts, productObjects } =
        await getLightTrapLogPlotData(productsIds, dateStart, dateEnd)

      let plotData = {}
      if (readyToPlotProducts.length > 0) {
        let data = []
        readyToPlotProducts.forEach((product) => {
          const obj = {
            data: [
              product.averageFlyActivity,
              product.averageBananaflyActivity,
              product.averageWaspActivity,
              product.averageNeuropteranActivity,
              product.averageDaddylonglegsActivity,
              product.averageMiscActivity,
            ],
            productName: `${product.product} - ${product.placement}`,
            id: product.id,
          }

          data.push(obj)
        })

        plotData = {
          labels: [
            'Flugor',
            'Bananflugor',
            'Getingar',
            'Nätvingar',
            'Harkrankar',
            'Övrigt',
          ],
          datasets: data,
        }
      }

      res.json({
        plotData,
        productObjects: [productObjects],
      })
    } catch (error) {
      next(createError(500))
    }
  }

  async findAllVisualTotal(req, res, next) {
    try {
      const {
        productsPeriodOne,
        productsPeriodTwo,
        productObjectsPeriodOne,
        productObjectsPeriodTwo,
      } = await getPlottableData(req.query)

      let plotData = {}
      if (productsPeriodOne.length > 0) {
        plotData = {
          labels: productsPeriodOne.map(
            (product) => `${product.product} - ${product.placement}`
          ),
          datasets: [
            {
              label: 'Period 1',
              data: productsPeriodOne.map(
                (product) =>
                  product.averageBananaflyActivity +
                  product.averageFlyActivity +
                  product.averageWaspActivity +
                  product.averageNeuropteranActivity +
                  product.averageDaddylonglegsActivity +
                  product.averageMiscActivity
              ),
            },
            {
              label: 'Period 2',
              data: productsPeriodTwo.map(
                (product) =>
                  product.averageBananaflyActivity +
                  product.averageFlyActivity +
                  product.averageWaspActivity +
                  product.averageNeuropteranActivity +
                  product.averageDaddylonglegsActivity +
                  product.averageMiscActivity
              ),
            },
          ],
        }
      }

      res.json({
        plotData,
        productObjects: [productObjectsPeriodOne, productObjectsPeriodTwo],
      })
    } catch (error) {
      next(createError(500))
    }
  }

  async findAllVisualForTrap(req, res, next) {
    try {
      const { trap, dateStart, dateEnd } = req.query

      const logs = await LightTrapLog.getByProduct(trap, dateStart, dateEnd)

      let plotData = {}
      plotData = {
        datasets: [
          {
            label: 'Totalt antal',
            data: logs.map((log) => ({
              x: log.dateLogged,
              y: log.total,
            })),
          },
        ],
      }

      res.json(plotData)
    } catch (error) {
      next(createError(500))
    }
  }

  async create(req, res, next) {
    try {
      const obj = new LightTrapLog({
        comment: req.body.comment,
        dateLogged: req.body.dateLogged,
        product: req.body.product,
        flyActivity: parseInt(req.body.flyActivity),
        bananaflyActivity: parseInt(req.body.bananaflyActivity),
        waspActivity: parseInt(req.body.waspActivity),
        neuropteranActivity: parseInt(req.body.neuropteranActivity),
        daddylonglegsActivity: parseInt(req.body.daddylonglegsActivity),
        miscActivity: parseInt(req.body.miscActivity),
      })

      await obj.save()

      const newURL = `https://${req.get('host')}${req.originalUrl}/${obj._id}`
      res.location(newURL).status(201).json(obj)
    } catch (error) {
      next(createError(500))
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params

      if (!id) {
        next(createError(400))
        return
      }

      const response = await LightTrapLog.findByIdAndDelete(id)

      if (!response) {
        next(createError(404))
        return
      }

      res.status(204).end()
    } catch (error) {
      next(createError(500))
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params

      if (id === undefined || id === null || id === '') {
        next(createError(400))
        return
      }

      const obj = await LightTrapLog.findByIdAndUpdate(id, req.body, {
        new: true,
      })

      if (!obj) {
        next(createError(404))
        return
      }

      const newURL = `https://${req.get('host')}${req.originalUrl}/${obj._id}`
      res.location(newURL).status(201).json(obj)
    } catch (error) {
      next(createError(500))
    }
  }
}
