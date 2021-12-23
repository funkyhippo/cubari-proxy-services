const endpoints = require("./endpoints.json");
const supertest = require("supertest");
const server = require("../src/server");
const { base64UrlEncode } = require("../src/utils");
const request = supertest(server.server);

describe("/v1/image/:url", () => {
  endpoints.map((endpoint) => {
    it(`Testing ${endpoint}`, async (done) => {
      await server.ready();
      const res = await request.get(`/v1/image/${base64UrlEncode(endpoint)}`);

      expect(res.status).toBe(200);
      expect(res.header["cache-control"]).toBeTruthy();
      done();
    }, 10000 /* 10 second timeout */);
  });

  it("Testing non-image request", async (done) => {
    await server.ready();
    const res = await request
      .get(`/v1/image/${base64UrlEncode("https://httpbin.org/status/200")}`)
      .set("origin", "jest.testing.local");
    expect(res.status).toBe(400);
    done();
  });

  it("Testing failed request to images", async (done) => {
    await server.ready();
    const res = await request
      .get(`/v1/image/${base64UrlEncode("https://httpbin.org/status/502")}`)
      .set("origin", "jest.testing.local");
    expect(res.status).toBe(400); // Should fail the content-type check, returning generic error
    done();
  });

  // TODO a redirect test would be nice
  // https://github.com/postmanlabs/httpbin/issues/617
});

describe("/v1/cors/:url", () => {
  it("Testing cors", async (done) => {
    await server.ready();
    const res = await request
      .get(`/v1/cors/${base64UrlEncode("https://httpbin.org/status/200")}`)
      .set("origin", "jest.testing.local");
    expect(res.status).toBe(200);
    expect(res.header["access-control-allow-origin"]).toBe(
      "jest.testing.local"
    );
    done();
  });

  it("Testing failed request to cors", async (done) => {
    await server.ready();
    const res = await request
      .get(`/v1/cors/${base64UrlEncode("https://httpbin.org/status/502")}`)
      .set("origin", "jest.testing.local");
    expect(res.status).toBe(502);
    done();
  });

  it("Testing missing headers", async (done) => {
    await server.ready();
    const res = await request.get(
      `/v1/cors/${base64UrlEncode("https://httpbin.org/status/200")}`
    );
    expect(res.status).toBe(400);
    done();
  });
});
