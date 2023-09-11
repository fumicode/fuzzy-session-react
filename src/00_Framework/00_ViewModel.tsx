export default interface ViewModel<T> {
  readonly main: T;
  readonly className?: string;
}
