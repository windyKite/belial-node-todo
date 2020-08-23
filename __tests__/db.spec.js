const db = require("../db");
const fs = require("fs");
const { option } = require("commander");
jest.mock("fs");

describe("db", () => {
  afterEach(() => {
    fs.clearMocks();
  });
  it("can read", async () => {
    const data = [{ title: "测试title", done: true }];
    fs.setReadMock("/xxx", null, JSON.stringify(data));
    const list = await db.read("/xxx");
    expect(list).toStrictEqual(data);
  });

  it("can write", async () => {
    let fakeFile;
    fs.setWriteMock("/yyy", (path, data, options, callback) => {
      fakeFile = data;
      if (callback === undefined) {
        callback = options;
      }
      callback(null);
    });
    const list = [
      { title: "测试写入title", done: false },
      { title: "测试写入111", done: true },
    ];
    await db.write(list, "/yyy");
    expect(fakeFile).toStrictEqual(JSON.stringify(list));
  });
});
