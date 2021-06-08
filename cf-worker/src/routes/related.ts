async function nextVideos(videoId, gl, hl) {

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
        "clientVersion": "2.20210218.08.00",
        "osName": "",
        "osVersion": "",
        "originalUrl": "",
        "platform": "DESKTOP",
        "gfeFrontlineInfo": "",
        "clientFormFactor": "UNKNOWN_FORM_FACTOR",
        "timeZone": "",
        "browserName": "",
        "browserVersion": "",
        "screenWidthPoints": 0,
        "screenHeightPoints": 0,
        "screenPixelDensity": 1,
        "screenDensityFloat": 1,
        "utcOffsetMinutes": 0,
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
    "videoId": videoId,
    "continuation": ""
  })

    const raw = await fetch(
      "https://www.youtube.com/youtubei/v1/next?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8",
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
    const json = await toJson(raw)
    return json
  }


  async function toJson(raw) {
    const data = await raw.json();
    //   Process the response to filter out minimal data.
    try {
      const videos = data.contents.twoColumnWatchNextResults.secondaryResults.secondaryResults.results
      
      const result = videos
        .map((item) => {
          try {
            const {
                compactVideoRenderer: {
                    title: { simpleText: titleText},
                    longBylineText: {runs},
                    thumbnail,
                    videoId,
                    lengthText: {simpleText: time}
              },
            } = item;

            return {
              type: 0,
              title: titleText,
              description: runs[0] ? runs[0].text : "",
              image: thumbnail.thumbnails.slice(-1)[0].url,
              videoId,
              time: time
            };
          } catch (e) {
            return null
          }
        })
        .filter((e) => e); // remove null values
  
        var continuation =  ""  
        try {
          contents.forEach(element => {
            if (element.continuationItemRenderer) {
              continuation = element.continuationItemRenderer.continuationEndpoint.continuationCommand.token
            }
          });
        } catch (error) {
          console.log(error)
        }
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

/**
 * Fetch and log a given request object
 * @param {Request} options
 */
async function Next(request: Request): Promise<Response> 
{
    let gl = request.headers.get('x-gl')
    let hl = request.headers.get('x-hl')

    const { searchParams } = new URL(request.url)
    let videoId = searchParams.get('videoId')
    var data = {}
    if (videoId && gl && hl) {
        data = await nextVideos(videoId, gl.toUpperCase(), hl.toLowerCase())
    }

    return new Response(JSON.stringify(data), {
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
      })
  }
  
  module.exports = Next;