const axios = require('axios');
const chalk = require('chalk');
const fs = require('fs');

const dataName = './data.json'
let data = require(dataName);
const groupsName = './groups.txt'
//let groups = require(groupsName);
let i = data.index
let found = data.found
console.log(i, found);

let errorTimeout = false
let running = 0
const maxRunning = 20;

function check() {
   if (errorTimeout == true || running >= maxRunning) return setTimeout(check, Math.round(Math.random() * 100));
   //console.log(running);
   //console.log('test');

   running++
   //console.log(`http://groups.roblox.com/v1/groups/${i}`);
   axios.get(`https://groups.roblox.com/v1/groups/${i}`).then(resp => {
      console.log('test');
      let text = ""
      let locked = false
      if (resp.data.publicEntryAllowed == true) {
         text += " - public"
      }

      if (resp.data.owner == null) {
         text += " - no owner"
      }

      if (resp.data.isLocked && resp.data.isLocked == true) {
         text += " - locked"
         locked = true
      };

      if (text == " - public - no owner") {
         found++
         console.clear();
         console.log(chalk.bgGreen(i + text + `- ${resp.data.memberCount} member(s) - ${found} found`))
         data.found = found
         data.index = i
         fs.writeFile(dataName, JSON.stringify(data, null, 2), (err) => {
            if (err) return console.error(err);
         });
         fs.appendFile(groupsName, `${resp.data.id} - Members: ${resp.data.memberCount}\n`, 'utf8', (err) => {
            if (err) console.error;
         });
      } else if (locked == true) {
         console.log(chalk.bgRed(i + text));
      } else {
         console.log(i + text);
      }
      check()
      running--
      i++
   }).catch(err => {
      //console.error('request error');
      //console.log(err);
      errorTimeout = true
      const process = require('process');
      process.exit();
      errorTimeout

      function enable() {
         //const proces = false
         running--
      }

      data.index = i
      fs.writeFile(dataName, JSON.stringify(data, null, 2), (err) => {
         if (err) return console.error(err);
      });

      setTimeout(enable, 5000);
      //running--
   });
}

// const runatOnce = 5

// for (index = 0; index <= runatOnce; index++) {
//    const delay = Math.round(Math.random() * 1000);
//    setTimeout(check, delay);
// }
//setInterval(check, 1050);
check();