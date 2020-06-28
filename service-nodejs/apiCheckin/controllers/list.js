const mongoose = require('mongoose')
const { errors, APIError } = require('../utils/exceptions')
const Checkin = require('../models/Checkin')

// eslint-disable-next-line
module.exports = async (req, res, next) => {
  try {
    // Get request params
    const session = req.user
    let sort = {
      createdAt: - 1,
    }
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 10
    const skip = (page - 1) * pageSize
    const search = req.query.search
    const _sort = req.query.sort

    const rules = [
      {
        $match: {
          'createdBy.email': session.email,
        },
      },
    ]

    if (_sort) {
      const __sort = _sort.split(',')
      sort = {
        [__sort[0]]: __sort[1] === 'asc' ? 1 : -1,
      }
    }

    if (search) {
      const terms = new RegExp(search, 'i')

      rules.push({
        '$match': {
          'location': {
            '$regex': terms,
          },
        },
      })

    }

    // Get page count
    const count = await Checkin.countDocuments({
      'createdBy.email': session.email
    })
    const filtered = await Checkin.aggregate([
      ...rules,
      {
        '$group': { _id: null, rows: { '$sum': 1 } },
      },
      {
        '$project': {
          rows: 1,
        },
      },
    ])

    const totalPage = Math.ceil((filtered.length > 0 ? filtered[0].rows : 0) / pageSize)

    // Get results
    const results = await Checkin
      .aggregate(rules)
      .skip(skip)
      .limit(pageSize)
      .sort(sort)

    res.status(200).json({
      filtered: filtered.length > 0 ? filtered[0].rows : 0,
      pageSize,
      results,
      _meta: {
        totalCount: count,
        totalPage: totalPage,
        currentPage: page,
        perPage: pageSize
      }
    })
  } catch (error) {
    const { code, message, data } = error

    if (code && message) {
        res.status(code).send({
            code,
            message,
            data,
        })
    } else {
        res.status(404).send(errors.notFound)
    }
  }
}
