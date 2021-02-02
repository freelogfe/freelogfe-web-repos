export type DvaReducer<S, A> = (state: S, action: A) => S;

export type WholeReadonly<T> = {
  readonly [P in keyof T]: WholeReadonly<T[P]>;
}

export type WholeMutable<T> = {
  -readonly [P in keyof T]: WholeMutable<T[P]>;
}
