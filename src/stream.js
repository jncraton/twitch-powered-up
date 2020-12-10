'use strict'

const { exec } = require('child_process')

function start (config) {
  const cmdString = `ffmpeg \
    -loglevel panic \
    -f lavfi \
    -i anullsrc=channel_layout=stereo:sample_rate=44100 \
    -f v4l2 \
    -video_size ${config.twitch.stream.videoSize} \
    -i ${config.twitch.stream.displayDevice} \
    -fflags nobuffer \
    -tune zerolatency \
    -vcodec libx264 \
    -r ${config.twitch.stream.framerate} \
    ${config.twitch.stream.videoFilter ? '-vf ' + config.twitch.stream.videoFilter : ''} \
    -g 30 \
    -pix_fmt yuv420p \
    -preset ${config.twitch.stream.qualityPreset} \
    -b:v ${config.twitch.stream.bitrate} \
    -force_key_frames 0:00:02 \
    -f flv \
    "rtmp://${config.twitch.stream.ingestServer}.twitch.tv/app/${config.twitch.stream.key}"`

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
    startStream.kill()
  })
}

module.exports = { start }
