# Config

The schema defines the following properties:

## `twitch` (object, required)

Settings related to authenticaion and streaming to Twitch.

Properties of the `twitch` object:

### `chat` (object, required)

Options related to the Twitch chat.

Properties of the `chat` object:

#### `auth` (string, required)

OAuth token for chat authentication.

#### `refresh` (string, required)

OAuth refresh token used in case of token expiration.

#### `username` (string, required)

Username to use for the chat bot.

#### `channel` (string, required)

Twitch channel that the bot will join.

#### `messageLifetime` (int, required)

Default lifetime for a message in milliseconds.

### `stream` (object, required)

Options related to the Twitch stream.

Properties of the `stream` object:

#### `key` (string, required)

Stream key provided by Twitch for stream authentication.

#### `framerate` (int, required)

Framerate in frames per second to use for the stream.

#### `ingestServer` (string, required)

Twitch server to use for the stream connection. The default value is probably fine, but you may want a closer server to reduce latency.

#### `displayDevice` (string, required)

File name of the video device you are streaming from

#### `qualityPreset` (string, required)

ffmpeg encoding preset

#### `bitrate` (string, required)

Target bitrate for ffmpeg stream output

#### `videoSize` (string, required)

Resolution of camera input

#### `videoFilter` (string)

Any desired ffmpeg video filters

## `devices` (array, required)

List of devices to pair with and control

The object is an array with all elements of the type `object`.

The array object has the following properties:

### `hub` (string, required)

Name of the hub. This is can be discovered and set in the Powered Up mobile app or using our `tpu-rename-hub` script.

### `port` (string, required)

Port letter the device is attached to

### `nouns` (array, required)

Word list that will cause chat messages to apply to this device

The object is an array with all elements of the type `string`.

### `actions` (array, required)

Actions to apply to this device from chat messages

The object is an array with all elements of the type `object`.

The array object has the following properties:

#### `verbs` (array, required)

Words that will trigger this action from a chat message

The object is an array with all elements of the type `string`.

#### `method` (string, required)

node-poweredup method to call on this device

#### `value` (int, required)

Default value to pass as the first argument to the method

#### `multiplier` (int)

Value multiplier. This defaults to 1.

#### `lifetime` (int)

Lifetime in milliseconds for this action

#### `relative` (boolean)

If true, the value for the method call will be summed with the current average
