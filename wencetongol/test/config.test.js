// The unconfigured case, which needs its own process: api/contact.js reads the
// credentials once at module load, so it cannot be un-set after importing.
import { test } from "node:test";
import assert from "node:assert/strict";

delete process.env.RESEND_API_KEY;
process.env.CONTACT_TO = "inbox@example.com";

const { default: handler } = await import("../api/contact.js");

test("reports which variable is missing, and never its value", async () => {
  const captured = { status: 0, payload: null };
  const res = {
    setHeader() {},
    status(code) {
      captured.status = code;
      return this;
    },
    json(payload) {
      captured.payload = payload;
      return this;
    },
  };

  await handler(
    {
      method: "POST",
      body: { name: "Jane", email: "jane@acme.com", message: "Hello" },
      headers: {},
    },
    res
  );

  assert.equal(captured.status, 503);
  assert.deepEqual(captured.payload.missing, ["RESEND_API_KEY"]);
  assert.equal(captured.payload.CONTACT_TO, undefined, "no values in the body");
});
