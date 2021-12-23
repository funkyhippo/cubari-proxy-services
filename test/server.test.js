const endpoints = require("./endpoints.json");
const supertest = require("supertest");
const server = require("../src/server");
const { base64UrlEncode } = require("../src/utils");
const request = supertest(server.server);

endpoints.map((endpoint) => {
  it(`Testing ${endpoint}`, async (done) => {
    await server.ready();
    const res = await request.get(`/v1/image/${base64UrlEncode(endpoint)}`);

    expect(res.status).toBe(200);
    expect(res.header["cache-control"]).toBeTruthy();
    done();
  }, 10000 /* 10 second timeout */);
});

it("Testing cors", async (done) => {
  await server.ready();
  const res = await request
    .get(`/v1/cors/${base64UrlEncode("https://example.com")}`)
    .set("origin", "jest.testing.local");
  expect(res.status).toBe(200);
  expect(res.header["access-control-allow-origin"]).toBe("jest.testing.local");
  done();
});
