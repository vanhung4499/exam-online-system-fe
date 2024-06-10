import { getToken } from '@/utils/auth'
import { jwtDecode } from 'jwt-decode'

export function parseJwt(token) {
  // Split the JWT into three parts
  var parts = token.split('.')
  // Decode the payload part of the JWT
  var payload = decodeBase64Url(parts[1])
  // Parse the decoded payload into an object
  return JSON.parse(payload)
}

function decodeBase64Url(input) {
  var base64 = input.replace(/-/g, '+').replace(/_/g, '/')
  switch (base64.length % 4) {
    case 0:
      break
    case 2:
      base64 += '=='
      break
    case 3:
      base64 += '='
      break
    default:
      throw 'Invalid base64 string'
  }
  return decodeURIComponent(atob(base64))
}

export function getTokenInfo() {
  const token = getToken()
  const decodedToken = jwtDecode(token)
  return JSON.parse(decodedToken.userInfo) // Assuming userInfo is directly in the payload
}
