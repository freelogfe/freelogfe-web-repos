self.importScripts('crypto-js.js');

self.addEventListener('message', (e) => {
  const reader = new FileReader();
  reader.onload = function() {
    const wordArray = CryptoJS.lib.WordArray.create(reader.result);
    const hash = CryptoJS.SHA1(wordArray).toString();
    self.postMessage({ sha1: hash });
  };
  reader.readAsArrayBuffer(e.data.file);
}, false);
