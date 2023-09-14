export type Action<T> = (current: T) => T;

export const peekIntoFuture = <T>(
  session: T,
  action: Action<T>
): boolean => {
  try {
    action(session);
    return true;
  } catch (e) {
    return false;
  }
};

export const calcErrorReason = <T>(
  entity: T,
  action: Action<T>
): string | undefined => {
  try {
    action(entity);
    return undefined;
  } catch (e) {
    if(e instanceof Error)
    return e.message;
  }
};
