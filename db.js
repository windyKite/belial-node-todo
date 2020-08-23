const path = require("path");
const fs = require("fs");
// 获取用户 home 目录, ~/
const homeDir = require("os").homedir();
const home = process.env.HOME || homeDir;
const dbPath = path.join(home, ".todo");

const db = {
  read(path = dbPath) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, { flag: "a+" }, (error, data) => {
        if (error) {
          return reject(error);
        }
        let list;
        try {
          list = JSON.parse(data.toString());
        } catch (e) {
          list = [];
        }
        resolve(list);
      });
    });
  },
  write(list, path = dbPath) {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, JSON.stringify(list), (error) => {
        if (error) {
          return reject(error);
        }
        resolve();
      });
    });
  },
};

module.exports = db;
