export interface Registry<T> {
  add(item: T): void
  delete(item: T): void
}

export interface StackFrame {
  id: number
  parent: number
  stack: string
}
