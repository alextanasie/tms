const expect = require("expect.js");
const { isAdminRequest } = require("../helpers/user-helpers");

describe("Helper functions", function() {
  describe("isAdminRequest", function() {
    it("should return false if regular user", async function() {
      const res = isAdminRequest({ role: 1 });
      expect(res).to.be(false);
    });
    it("should return false if user manager", async function() {
      const res = isAdminRequest({ role: 2 });
      expect(res).to.be(false);
    });
    it("should return true if admin", async function() {
      const res = isAdminRequest({ role: 3 });
      expect(res).to.be(true);
    });
  });
});
