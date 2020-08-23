const db = require("./db");
const inquirer = require("inquirer");

module.exports.add = async (title) => {
  // 读取之前的任务
  const list = await db.read();
  // 往任务里面添加 title
  list.push({ title, done: false });
  // 存储任务到文件
  db.write(list);
};

module.exports.clear = async () => {
  await db.write([]);
};

function askForCreateTask(list) {
  inquirer
    .prompt({
      type: "input",
      name: "title",
      message: "请输入任务标题",
    })
    .then(async (answer) => {
      list.push({ title: answer.title, done: false });
      await db.write(list);
      console.log('创建成功!')
    });
}

function markAsDone(list, index) {
  list[index].done = true;
  db.write(list);
}

function markAsUndone(list, index) {
  list[index].done = false;
  db.write(list);
}

function updateTitle(list, index) {
  inquirer
    .prompt({
      type: "input",
      name: "title",
      message: "请输入新的标题",
      default: list[index].title,
    })
    .then((answer3) => {
      list[index].title = answer3.title;
      db.write(list);
      console.log(answer3.title);
    });
}

function remove(list, index) {
  list.splice(index, 1);
  db.write(list);
}

function askForAction(list, index) {
  inquirer
    .prompt({
      type: "list",
      name: "action",
      message: "请选择操作",
      choices: [
        { name: "退出", value: "quit" },
        { name: "已完成", value: "markAsDone" },
        { name: "未完成", value: "markAsUndone" },
        { name: "改标题", value: "updateTitle" },
        { name: "删除", value: "remove" },
      ],
    })
    .then((answer) => {
      const actions = {
        markAsDone,
        markAsUndone,
        updateTitle,
        remove,
      };
      const action = actions[answer.action];
      action && action(list, index);
    });
}

function printTasks(list) {
  inquirer
    .prompt({
      type: "list",
      name: "index",
      message: "请选择任务",
      choices: [
        { name: "退出", value: "-1" },
        ...list.map((task, index) => {
          return {
            name: `${task.done === true ? "[x]" : "[_]"} ${index + 1} - ${
              task.title
            }`,
            value: String(index),
          };
        }),
        { name: "创建任务", value: "-2" },
      ],
    })
    .then((answer) => {
      const index = parseInt(answer.index);
      if (index >= 0) {
        // askForAction
        askForAction(list, index);
      } else if (index === -2) {
        // 创建任务
        askForCreateTask(list);
      }
    });
}

module.exports.showAll = async () => {
  const list = await db.read();
  // printTasks
  printTasks(list);
};
