const handler = require('./handler');

addEventListener('fetch', (event) => {
  if (event.request.method === "GET") {
    event.respondWith(handler(event))
  } else {
    return new Response("Method not allowed", { status: 500 })
  }
})
