async function playlist(playlistId, gl, hl) {
  const raw = await fetch(
    `https://www.youtube.com/playlist?list=${playlistId}`,
    {
      headers: {
        accept: "*/*",
        "accept-language": `${hl}-${gl},${hl}`,
      }
    }
  );
  console.log("-----------------------")
  const html = await raw.text()
  var data = html.substring(html.indexOf("ytInitialData"));
  const to = data.indexOf("{");
  const fr = data.indexOf("};");
  data = data.substring(to, fr + 1);
  var list = JSON.parse(data);
  const videos = list.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].playlistVideoListRenderer.contents
  return toJson(videos)
}

async function nextPlaylist(token, gl, hl) {

  const body = JSON.stringify({
    "context": {
      "client": {
        "hl": hl,
        "gl": gl,
        "remoteHost": "",
        "deviceMake": "",
        "deviceModel": "",
        "visitorData": "",
        "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15,gzip(gfe)",
        "clientName": "WEB",
        "clientVersion": "2.20210218.08.01",
        "osName": "",
        "osVersion": "",
        "originalUrl": "",
        "platform": "DESKTOP",
        "gfeFrontlineInfo": "",
        "clientFormFactor": "UNKNOWN_FORM_FACTOR",
        "timeZone": "",
        "browserName": "",
        "browserVersion": "",
        "screenWidthPoints": "0",
        "screenHeightPoints": "0",
        "screenPixelDensity": "0",
        "screenDensityFloat": "0",
        "utcOffsetMinutes": "0",
        "userInterfaceTheme": "USER_INTERFACE_THEME_LIGHT",
        "mainAppWebInfo": {
          "graftUrl": "",
          "webDisplayMode": "WEB_DISPLAY_MODE_BROWSER"
        }
      },
      "user": {
        "lockedSafetyMode": false
      },
      "request": {
        "useSsl": true,
        "internalExperimentFlags": [],
        "consistencyTokenJars": []
      },
      "clickTracking": {
        "clickTrackingParams": ""
      },
      "clientScreenNonce": ""
    },
    "continuation": token
  });

  const raw = await fetch(
    "https://www.youtube.com/youtubei/v1/browse?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8",
    {
      headers: {
        accept: "*/*",
        "content-type": "application/json",
        "x-origin": "https://www.youtube.com",
      },
      body: body,
      method: "POST"
    }
  );
  console.log("-----------------------")
  const data = await raw.json();
  const videos = data.onResponseReceivedActions[0].appendContinuationItemsAction.continuationItems
  return toJson(videos)
}

async function toJson(videos) {
  //   Process the response to filter out minimal data.
  try {
    var continuation = ""
    const result = videos
      .map((item) => {
        const video = toVideo(item)
        if (video) {
          return video
        }

        try {
          continuation = item.continuationItemRenderer.continuationEndpoint.continuationCommand.token
        } catch (error) {
          console.log(error)
          return item
        }
      })
      .filter((e) => e); // remove null values

    const jsonData = {
      results: result,
      token: continuation
    }
    console.log('-----done -------')
    return jsonData
  } catch (error) {
    return {}
  }
}

function toVideo(item) {
  try {
    const {
      playlistVideoRenderer: {
        title,
        shortBylineText: { runs },
        thumbnail,
        videoId,
        lengthText: { simpleText: time }
      },
    } = item;

    return {
      type: 0,
      title: title.runs[0].text,
      description: runs[0] ? runs[0].text : "",
      image: thumbnail.thumbnails.slice(-1)[0].url,
      videoId,
      time: time
    };
  } catch (e) {
    console.log(e)
    return null
  }
}

/**
 * Fetch and log a given request object
 * @param {Request} options
 */
async function Playlist(request: Request): Promise<Response> {
  let gl = request.headers.get('x-gl')
  let hl = request.headers.get('x-hl')

  const { searchParams } = new URL(request.url)
  let playlistId = searchParams.get('playlist')
  var data = {}
  if (playlistId && gl && hl) {
    data = await playlist(playlistId, gl.toUpperCase(), hl.toLowerCase())
  } else {
    let token = searchParams.get('token')
    if (token && gl && hl) {
      data = await nextPlaylist(token, gl.toUpperCase(), hl.toLowerCase())
    }
  }

  return new Response(JSON.stringify(data), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  })
}

module.exports = Playlist;