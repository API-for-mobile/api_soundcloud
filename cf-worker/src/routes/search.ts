
async function tracks(request: Request): Promise<Response> {

  const { searchParams } = new URL(request.url)
  let keySearch = searchParams.get('q')
  if (!keySearch) {
    return new Response(JSON.stringify({
      error: "not error"
    }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    })
  }
  const page = searchParams.get('page')
  let url;
  if (!page || page == "0") {
    url = `https://api-mobile.soundcloud.com/search/tracks?q=${encodeURI(keySearch)}&limit=24&client_id=Fiy8xlRI0xJNNGDLbPmGUjTpPRESPx8C`
  } else {
    url = `https://api-mobile.soundcloud.com/search/tracks?q=${encodeURI(keySearch)}&limit=24&next=${parseInt(page) * 24}&client_id=Fiy8xlRI0xJNNGDLbPmGUjTpPRESPx8C`
  }

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

async function albums(request: Request): Promise<Response> {

  const { searchParams } = new URL(request.url)
  let keySearch = searchParams.get('q')
  if (!keySearch) {
    return new Response(JSON.stringify({
      error: "not error"
    }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    })
  }
  const page = searchParams.get('page')
  let url;
  if (!page || page == "0") {
    url = `https://api-mobile.soundcloud.com/search/albums?q=${encodeURI(keySearch)}&limit=24&client_id=Fiy8xlRI0xJNNGDLbPmGUjTpPRESPx8C`
  } else {
    url = `https://api-mobile.soundcloud.com/search/albums?q=${encodeURI(keySearch)}&limit=24&next=${parseInt(page) * 24}&client_id=Fiy8xlRI0xJNNGDLbPmGUjTpPRESPx8C`
  }

  var requestOptions = {
    method: 'GET',
    headers: request.headers
  };

  const response = await fetch(url, requestOptions)
  const jsonData = await response.json()
  const collection = jsonData.collection
  let albums = []
  collection.forEach(track => {
    albums.push({
      id: track.urn,
      title: track.title,
      image: track.artwork_url_template ? track.artwork_url_template.replace("{size}", "t300x300") : "",
      count: track.track_count,
      description: track.description,
    })
  });
  return new Response(JSON.stringify({
    albums: albums
  }), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  })
}

async function playlists(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url)
  let keySearch = searchParams.get('q')
  if (!keySearch) {
    return new Response(JSON.stringify({
      error: "not error"
    }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    })
  }
  const page = searchParams.get('page')
  let url;
  if (!page || page == "0") {
    url = `https://api-mobile.soundcloud.com/search/playlists_without_albums?q=${encodeURI(keySearch)}&limit=24&client_id=Fiy8xlRI0xJNNGDLbPmGUjTpPRESPx8C`
  } else {
    url = `https://api-mobile.soundcloud.com/search/playlists_without_albums?q=${encodeURI(keySearch)}&limit=24&next=${parseInt(page) * 24}&client_id=Fiy8xlRI0xJNNGDLbPmGUjTpPRESPx8C`
  }

  var requestOptions = {
    method: 'GET',
    headers: request.headers
  };

  const response = await fetch(url, requestOptions)
  const jsonData = await response.json()
  const collection = jsonData.collection

  let playlists = []
  collection.forEach(track => {
    playlists.push({
      id: track.urn,
      title: track.title,
      image: track.artwork_url_template ? track.artwork_url_template.replace("{size}", "t300x300") : "",
      count: track.track_count,
      description: track.description,
    })
  });
  return new Response(JSON.stringify({
    playlists: playlists
  }), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  })
}

module.exports = {
  tracks,
  albums,
  playlists
};

