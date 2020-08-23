const fs = jest.createMockFromModule("fs");
const _fs = jest.requireActual("fs");

Object.assign(fs, _fs);

let readMocks = {};

fs.setReadMock = (path, error, data) => {
  readMocks[path] = [error, data];
};

fs.readFile = (path, options, callback) => {
  if (callback === undefined) {
    callback = options;
  }
  if (path in readMocks) {
    callback(...readMocks[path]);
  } else {
    _fs.readFile(path, options, callback);
  }
};

let writeMocks = {};

fs.setWriteMock = (path, fn) => {
  writeMocks[path] = fn;
};

fs.writeFile = (path, data, options, callback) => {
  if(path in writeMocks){
    writeMocks[path](path, data, options, callback)
  }else{
    _fs.writeFile(path, data, options, callback)
  }
};

// 清除 mocks, 防止测试互相干扰
fs.clearMocks = () => {
  readMocks = {}
  writeMocks = {}
}

module.exports = fs;
