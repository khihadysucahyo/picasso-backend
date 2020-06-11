const { errors, APIError } = require('../utils/exceptions')
// Import Model
const LogBook = require('../models/LogBook')

// eslint-disable-next-line
module.exports = async (req, res, next) => {
  try {
    const { _id } = req.params

    if (!_id) throw new APIError(errors.notFound)

    await LogBook.findByIdAndDelete(_id)

    res.status(200).json({
      code: 'DataDeleted',
      message: 'Data has been successfully deleted',
    })
  } catch (error) {
    next(error)
  }
}
