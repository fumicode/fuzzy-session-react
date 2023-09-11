export type Future<T> = (current: T) => T;

export const peekIntoFuture = <T>(
  session: T,
  future: Future<T>
): boolean => {
  try {
    future(session);
    return true;
  } catch (e) {
    return false;
  }
};

export const calcErrorReason = <T>(
  entity: T,
  future: Future<T>
): string | undefined => {
  try {
    future(entity);
    return undefined;
  } catch (e) {
    if(e instanceof Error)
    return e.message;
  }
};
