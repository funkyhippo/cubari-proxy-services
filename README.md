# Cubari Proxy Services

A service that combines a CORS and image proxy.

Routes are seperated to serve different needs.

Targets are base64 URL encoded and appended as path parameters.

If the origin server is rejecting the response, try playing with the `host` query parameter. For example, `https://<service>/v1/image/<base64_url_encoded>?host=imgur.com`.

## Known Mappings

In order to skip the host parameter requirement, known domains are mapped to the host the server expects. Currently known mappings are stored in [mapping.json](./mapping.json).

## Testing

Every URL in [endpoints.json](./test/endpoints.json) will be tested against the proxy to verify that the proxy successfully loads.

## Contributions

If you'd like to add an additional mapping, feel free to open a PR. Please also add a test for the domain if you do so.
