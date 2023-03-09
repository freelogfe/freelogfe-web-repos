self.importScripts('crypto-js.js');

self.addEventListener('message', (e) => {
  const wordArray = CryptoJS.lib.WordArray.create(e.data.fileArrayBuffer);
  const hash = CryptoJS.SHA1(wordArray).toString();
  self.postMessage({ sha1: hash, uid: e.data.uid });
  // const reader = new FileReader();
  // reader.onload = function() {
  //
  // };
  // reader.readAsArrayBuffer(e.data.file);
}, false);
