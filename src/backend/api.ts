import { list, download } from './torrent';
const util = require('util');

const cors = require('cors');
const twilio = require('twilio');

// you would use cookies/token etc
const USER_ID = 'f9d98cf1-1b96-464e-8755-bcc2a5c09077'; // hardcoded as an example

// Fetch new ice_servers from twilio token regularly
let iceServers
let twilioClient
try {
  twilioClient = twilio('AC8d9efd38dc4d678299b41855c005329d', 'b355ed16a0efa8d7af1fd85575dcaeb0')
} catch (err) {}

function error(err) {
  console.error(err.stack || err.message || err)
}

function updateIceServers () {
  twilioClient.tokens.create({}, function (err, token) {
    if (err) return error(err)
    if (!token.ice_servers) {
      return error(new Error('twilio response ' + token + ' missing ice_servers'))
    }

    iceServers = token.ice_servers
      .filter(function (server) {
        var urls = server.urls || server.url
        return urls && !/^stun:/.test(urls)
      })
    iceServers.unshift({ urls: 'stun:23.21.150.121' })

    // Support new spec (`RTCIceServer.url` was renamed to `RTCIceServer.urls`)
    iceServers.forEach(function (server) {
      if (server.url != null) {
        server.urls = server.url
        delete server.url
      }
    })
  })
}

if (twilioClient) {
  setInterval(updateIceServers, 60 * 60 * 4 * 1000).unref()
  updateIceServers()
}

export function getRtcConfig(req, res) {
  return res.json({iceServers})
}

export function listTorrent(req, res) {
  return list(req, res);
}

export function downloadTorrent(req, res) {
  return download(req, res);
}
