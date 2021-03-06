const HOME_TEXT = `Info here: https://github.com/funkyhippo/cubari-proxy-services

All URLs should be base64 URL encoded.

# /v1/cors/:url

Image content-types will fail. Requires origin or x-requested-with headers.


# /v1/image/:url

The resolution strategy for images is as follows; the referrer is set as:
1. Host query parameter (ie. ?host=<referrer>)
2. Known mapping in the repo
3. Target origin

# Generating Base64 URL Encoded Strings


## Python

import base64
base64.urlsafe_b64encode("https://example.com", "utf-8")


## JavaScript (Web)

btoa("https://example.com").replace(/\\+/g, "-").replace(/\\//g, "_")

`;

async function routes(fastify, options) {
  fastify.get("/", async (request, reply) => {
    return HOME_TEXT;
  });
}

module.exports = routes;
