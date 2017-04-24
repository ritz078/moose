module.exports = {
  plugins: [
    require('postcss-easy-import')({prefix: '_'}),
    require('autoprefixer')()
  ]
}
