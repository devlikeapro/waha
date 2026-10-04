'use strict'
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./reselect.production.min.cjs')
} else {
  module.exports = require('./reselect.development.cjs')
}