const Router = require('./router')

const Search = require('./routes/search')
const Playlist = require('./routes/playlist')
const Related = require('./routes/related')
/**
 * Fetch and log a given request object
 * @param {Request} options
 */
async function handler(event: FetchEvent) {
   return handleRequest(event)
}

async function handleRequest(event: FetchEvent) {

   const r = new Router()
   const request_ev = event.request
   r.get('/api/search/tracks.*', (request) => Search.tracks(request_ev))
   r.get('/api/search/albums.*', (request) => Search.albums(request_ev))
   r.get('/api/search/playlists.*', (request) => Search.playlists(request_ev))

//    r.get('/api/playlist.*', (request) => Playlist(request_ev))
//    r.get('/api/related.*', (request) => Related(request_ev))

   const resp = await r.route(request_ev)
   return resp
}

module.exports = handler;
