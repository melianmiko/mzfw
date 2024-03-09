const PLACEHOLDER_FUNC = () => {};

export class Deferred<P> {
  public promise: Promise<P>;
  public resolve: (value: (PromiseLike<P> | P)) => void = PLACEHOLDER_FUNC;
  public reject: (reason?: any) => void = PLACEHOLDER_FUNC;

  constructor() {
    this.promise = new Promise<P>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    })
  }
}
