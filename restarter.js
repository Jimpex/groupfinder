// const {
//    spawn,
//    fork
// } = require('child_process');
// let finder = fork('./app.js');

// finder.on('data', (data) => {
//    console.log(data);
// })

// finder.on('error', (err) => {
//    console.log(err);
// });

// finder.on('exit', (code) => {
//    console.log('exited');
//    finder = fork('./app.js');
// })

const cluster = require('cluster');

if (cluster.isMaster) {
   cluster.fork();

   cluster.on('exit', () => {
      cluster.fork();
   })
} else {
   require('./app.js');
};