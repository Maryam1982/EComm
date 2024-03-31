const fs = require("fs");
const crypto = require("crypto");
const util = require("util");
const repository = require("./repository");

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends repository {
  async create(attr) {
    attr.id = this.randomId();
    const salt = crypto.randomBytes(8).toString("hex");
    const hashed = await scrypt(attr.password, salt, 64);

    const records = await this.getAll();
    const record = { ...attr, password: `${hashed.toString("hex")}.${salt}` };
    records.push(record);
    await this.writeAll(records);

    return record;
  }

  async comparePasswords(savedPass, suppliedPass) {
    const [pass, salt] = savedPass.split(".");
    const buf = await scrypt(suppliedPass, salt, 64);

    return pass === buf.toString("hex");
  }
}

module.exports = new UsersRepository("users.json");
