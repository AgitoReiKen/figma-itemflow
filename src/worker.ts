// console.log('Worker initialized');
onmessage = function (event) {
  console.log(event);
  this.postMessage('message from worker');
};
