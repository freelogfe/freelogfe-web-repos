// import { RcFile } from 'antd/lib/upload/interface';
//
// const scriptURL: string = '/js/getSHA1Hash.js';
// const limitRunningTaskCount: number = 2;
//
// class FileSha1Queue {
//
//   private _promiseTasks: {
//     resolve: (value: string | PromiseLike<string>) => void;
//     file: RcFile;
//   }[] = [];
//   private _runningTaskCount: number = 0;
//
//   public async getSha1(this: FileSha1Queue, file: RcFile): Promise<string> {
//     return new Promise((resolve) => {
//       this._promiseTasks.push({
//         resolve,
//         file,
//       });
//       this._getSHA1Hash();
//     });
//   }
//
//   private async _getSHA1Hash(this: FileSha1Queue) {
//     if (this._runningTaskCount >= limitRunningTaskCount || this._promiseTasks.length === 0) {
//       return;
//     }
//     const promiseTask = this._promiseTasks.pop();
//     if (!promiseTask) {
//       return;
//     }
//     const { resolve, file } = promiseTask;
//     this._runningTaskCount++;
//     const fileArrayBuffer: ArrayBuffer = await file.arrayBuffer();
//     const worker: Worker = new Worker(scriptURL);
//     worker.postMessage({ fileArrayBuffer }, [fileArrayBuffer]);
//     worker.addEventListener('message', (e: any) => {
//       resolve(e.data.sha1);
//       this._runningTaskCount--;
//       worker.terminate();
//       this._getSHA1Hash();
//     });
//   }
// }
//
// const fileSha1Queue = new FileSha1Queue();
// export default fileSha1Queue;
