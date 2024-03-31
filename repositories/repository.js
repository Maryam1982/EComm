const fs = require("fs");
const crypto = require("crypto");

module.exports = class Repository {
  constructor(filename) {
    if (!filename) {
      throw new Error("Creating users repository requires a filename");
    }
    this.filename = filename;

    try {
      fs.accessSync(filename);
    } catch (err) {
      fs.writeFileSync(filename, "[]");
    }
  }

  async create(attrs) {
    attrs.id = this.randomId();
    const records = await this.getAll();
    records.push(attrs);
    await this.writeAll(records);
    return attrs;
  }

  async getAll() {
    //OPEN FILE
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: "utf-8",
      })
    );
  }

  async writeAll(records) {
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2)
    );
  }

  randomId() {
    return crypto.randomBytes(4).toString("hex");
  }

  async getOne(id) {
    const records = await this.getAll();
    return records.find((record) => record.id === id);
  }

  async delete(id) {
    const records = await this.getAll();
    const filteredRecs = records.filter((record) => record.id !== id);
    await this.writeAll(filteredRecs);
  }

  async update(id, attrs) {
    const records = await this.getAll();
    const recToUpdate = records.find((record) => record.id === id);
    if (!recToUpdate) {
      throw new Error("Record was not found.");
    }
    Object.assign(recToUpdate, attrs);
    await this.writeAll(records);
  }

  async getOneBy(filters) {
    const records = await this.getAll();
    const foundRecs = records.filter((record) => {
      let found = true;
      for (let key in filters) {
        if (record[key] !== filters[key]) {
          found = false;
        }
      }
      return found;
    });
    return foundRecs;
  }
};
