const fs = require('fs');

fs.readFile('groups.txt', 'utf8', (err, data) => {
   if (err) console.error(err);

   let lines = data.split("\n");
   let groupArray = []

   // let groupId = lines[0].split(" ")[0]
   // let members = lines[0].slice(groupId.length + " - Members: ".length, lines[0].length);
   // console.log(groupId, members)

   lines.forEach(line => {
      let args = line.split(" ");
      let groupId = args[0]
      let members = args[args.length - 1] //line.slice(groupId.length + " - Members: ".length, lines[0].length);
      //console.log(groupId, members);
      groupArray.push({
         id: groupId,
         members: members
      });
      // if (groupArray.length == lines.length - 1) {
      //    groupArray.sort((a, b) => {
      //       //console.log(a, b);
      //       return a.members - b.members
      //    });
      //    console.log(groupArray[0])
      // }
   });
   console.log(groupArray.length);
   groupArray.sort((a, b) => {
      //console.log(a, b);
      return a.members - b.members
   });
   let amount = 100
   let sortedGroups = []
   for (index = 0; index < amount; index++) {
      sortedGroups.push(groupArray[groupArray.length - 1 - index]);
   }
   fs.writeFile('./sortedGroups.json', JSON.stringify(sortedGroups), (err) => {
      console.log('done');
   })
   console.log(groupArray[groupArray.length - 2])
   //console.log(lines.length, lines[0]);

   //console.log(data);
});