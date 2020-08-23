#!/usr/bin/env node
const program = require("commander");
const api = require("./index.js");
const pkg = require("./package.json");

// 命令行选项
program.version(pkg.version);

// 命令行子命令
program
  .command("add <taskName>")
  .description("add a task")
  .action((taskName, destination) => {
    api.add(taskName).then(
      () => {
        console.log("添加成功!");
      },
      () => {
        console.log("添加失败!");
      }
    );
  });
program
  .command("clear")
  .description("clear all task")
  .action(() => {
    api.clear().then(
      () => {
        console.log("清除成功!");
      },
      () => {
        console.log("清除失败!");
      }
    );
  });


if (process.argv.length === 2) {
  api.showAll();
} else { 
  program.parse(process.argv);
}
