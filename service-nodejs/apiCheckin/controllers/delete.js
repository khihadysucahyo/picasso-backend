const { errors, APIError } = require('../utils/exceptions')
// Import Model
const Checkin = require('../models/Checkin')

// eslint-disable-next-line
module.exports = async (req, res, next) => {
  try {
    const { _id } = req.params

    if (!_id) throw new APIError(errors.notFound)

    await Checkin.findByIdAndDelete(_id)

    res.status(200).json({
      code: 'DataDeleted',
      message: 'Data has been successfully deleted',
    })
  } catch (error) {
    next(error)
  }
}
