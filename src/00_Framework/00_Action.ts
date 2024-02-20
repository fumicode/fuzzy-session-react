export type Action<T> = (current: T) => T;

export const peekIntoFuture = <T>(obj: T, action: Action<T>): boolean => {
  try {
    action(obj);
    return true;
  } catch (e) {
    return false;
  }
};

export const calcErrorReason = <T>(
  obj: T,
  action: Action<T>
): string | undefined => {
  try {
    action(obj);
    return undefined;
  } catch (e) {
    if (e instanceof Error) return e.message;
  }
};
