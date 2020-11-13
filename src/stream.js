'use strict'

const { exec } = require('child_process')
const config = require('../config.json')

function start () {
  const STREAM_KEY = config.twitch.stream.streamKey // Stream key from twitch that is read from the config file
  const INGEST_SERVER = config.twitch.stream.ingestServer // twitch server in Chicago, see https://bashtech.net/twitch/ingest.php to change
  const DISPLAY_DEVICE = config.twitch.stream.displayDevice
  const FRAMERATE = config.twitch.stream.framerate
  const QUALITY = config.twitch.stream.qualityPreset // one of the many FFMPEG preset

  const cmdString = `ffmpeg -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 -f v4l2 -video_size 640x480 -i ${DISPLAY_DEVICE} -vcodec libx264 -r ${FRAMERATE} -vf "scale=640:360" -g 30 -pix_fmt yuv420p -preset ${QUALITY} -f flv "rtmp://${INGEST_SERVER}.twitch.tv/app/${STREAM_KEY}"`

  exec(cmdString, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`)
      return
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`)
      return
    }
    console.log(`stdout: ${stdout}`)
  })
}

module.exports = { start }
