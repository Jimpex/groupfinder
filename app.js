const axios = require('axios');
const chalk = require('chalk');
const fs = require('fs');
//1350429

const dataName = './data.json'
let data = require(dataName);
const groupsName = './groups.txt'
//let groups = require(groupsName);

let i = data.index
let found = data.found

let errorTimeout = false
let running = 0
const maxRunning = 20;

function check() {
   if (errorTimeout || running >= maxRunning) return setTimeout(check, Math.round(Math.random() * 100));
   //console.log(running);

   running++
   // console.log(running);
   axios.get(`https://groups.roblox.com/v1/groups/${i}`).then(resp => {
      if (resp.data.id == null) {
         i++
         console.log('Group does not exist');
      };
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
      if (err.response.data.errors[0].message == 'Group is invalid or does not exist.') return i++ & running-- && console.log(`Group invalid/does not exist ${i}`);
      console.error('request error', i);
      errorTimeout = true

      function enable() {
         const process = require('process');
         process.exit();
         errorTimeout = false
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
setInterval(check, 40);