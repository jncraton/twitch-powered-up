'use strict'

const { exec } = require('child_process')

function start (config) {
  const STREAM_KEY = config.twitch.stream.streamKey // Stream key from twitch that is read from the config file
  const INGEST_SERVER = config.twitch.stream.ingestServer // twitch server in Chicago, see https://bashtech.net/twitch/ingest.php to change
  const DISPLAY_DEVICE = config.twitch.stream.displayDevice
  const FRAMERATE = config.twitch.stream.framerate
  const QUALITY = config.twitch.stream.qualityPreset // one of the many FFMPEG preset

  const cmdString = `ffmpeg -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 -f v4l2 -video_size 640x480 -i ${DISPLAY_DEVICE} -fflags nobuffer -tune zerolatency -vcodec libx264 -r ${FRAMERATE} -vf "crop=640:360:0:60" -g 30 -pix_fmt yuv420p -preset ${QUALITY} -b:v 1000k -force_key_frames 0:00:02  -f flv "rtmp://${INGEST_SERVER}.twitch.tv/app/${STREAM_KEY}"`

  const startStream = exec(cmdString, (error, stdout, stderr) => {
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

  process.on('exit', function () {
    startStream.kill();
  })
}

module.exports = { start }
