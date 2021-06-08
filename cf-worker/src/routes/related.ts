/**
 * Fetch and log a given request object
 * @param {Request} options
 */
async function Related(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url)
  let id = searchParams.get('id')
  if (!id) {
    return new Response(JSON.stringify({
      error: "not error"
    }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    })
  }

  let url = `https://api-mobile.soundcloud.com/tracks/${id}/related?client_id=Fiy8xlRI0xJNNGDLbPmGUjTpPRESPx8C`
  console.log(url)
  var requestOptions = {
    method: 'GET',
    headers: request.headers
  };

  const response = await fetch(url, requestOptions)
  const jsonData = await response.json()
  const collection = jsonData.collection

  let tracks = []
  collection.forEach(track => {
    let stream_url = track.stream_url
    if (!stream_url) {
      let transcodings = track.media.transcodings
      stream_url = transcodings[transcodings.length - 1].url
    }
    stream_url = stream_url.replace("https://api-mobile.soundcloud.com", "")
    tracks.push({
      id: track.urn,
      title: track.title,
      image: track.artwork_url_template ? track.artwork_url_template.replace("{size}", "t300x300") : "",
      duration: track.full_duration,
      description: track.description,
      username: track["_embedded"].user.username,
      media: stream_url
    })
  });
  return new Response(JSON.stringify({
    tracks: tracks
  }), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  })
}

module.exports = Related;