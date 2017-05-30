var serveFile = require('./serve-file')

var routes = module.exports = require('http-hash')()

routes.set('/', serveFile('homepage.html'))
routes.set('/styles.css', serveFile('styles.css'))

routes.set('/about', serveFile('about.html'))

routes.set('/guide', serveFile('guide.html'))
routes.set('/guide.js', serveFile('guide.js'))

routes.set('/publish', require('./publish'))
routes.set('/publish.js', serveFile('publish.js'))

routes.set('/key', require('./key'))
routes.set('/publications', require('./publications'))
routes.set('/publications/:digest', require('./publication'))
routes.set('/publications/:digest/signature', require('./signature'))
routes.set(
  '/publications/:digest/attachments/:attachment',
  require('./attachment')
)

routes.set('/accessions/:number', require('./accession'))

routes.set('/robots.txt', serveFile('robots.txt'))

routes.set('/declaration', serveFile('declaration.txt'))
routes.set('/license', serveFile('license.txt'))
