const mongoose = require('mongoose')
const { errors, APIError } = require('../utils/exceptions')
const Attendance = require('../models/Attendance')
const moment = require('moment')
moment.locale('id')

// eslint-disable-next-line
module.exports = async (req, res, next) => {
  try {
    // Get request params
    const session = req.user
    let sort = {
      startDate: 1,
    }
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 10
    const skip = (page - 1) * pageSize
    const search = req.query.search
    const _sort = req.query.sort
    let start = moment().set({
      "hour": 0,
      "minute": 0,
      "second": 0
    }).format()

    let end = moment().set({
      "hour": 23,
      "minute": 59,
      "second": 59
    }).format()

    const rules = [
      {
        $match: {
          createdAt: {
            $gte: new Date(start),
            $lt: new Date(end)
          }
        },
      },
      {
        '$project': {
          'startDate': 1,
          'endDate': 1,
          'officeHours': 1,
          'location': 1,
          'message': 1,
          'email': '$createdBy.email',
          'username': '$createdBy.username',
          'divisi': '$createdBy.divisi',
          'jabatan': '$createdBy.jabatan'
        }
      }
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
    const count = await Attendance.countDocuments({
      'createdBy.email': session.email,
      startDate: {
        $gte: new Date(start),
        $lt: new Date(end)
      }
    })
    const filtered = await Attendance.aggregate([
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
    const results = await Attendance
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
