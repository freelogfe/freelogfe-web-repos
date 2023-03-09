class FWorkerPool {

  private _scriptURL: string;
  private _worker: Worker | null = null;
  private _referenceCount: number = 0;

  constructor(scriptURL: string) {
    this._scriptURL = scriptURL;
  }

  public getWorker(this: FWorkerPool): Worker {
    if (!this._worker) {
      this._worker = new Worker(this._scriptURL);
    }
    this._referenceCount++;
    return this._worker;
  }

  public terminate(this: FWorkerPool): void {
    this._referenceCount--;

    if (!!this._worker && this._referenceCount === 0) {
      this._worker.terminate();
      this._worker = null;
    }
  }
}
