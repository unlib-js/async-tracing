import { createHook, executionAsyncId, type AsyncHook } from 'async_hooks'
import { Registry, type StackFrame } from './types'

/**
 * The `Tracer` uses the `async_hooks` module to track the lifecycle of
 * promises and maintain stacks of execution contexts. The `Tracer` class is
 * designed to be used in conjunction with a `Registry` implementation, which
 * holds a collection of `Tracer` instances.
 */
export default class Tracer {
  public readonly stacks = new Map<number, StackFrame>()
  private readonly hook: AsyncHook
  private readonly parents = new Set<number>()

  public rootAsyncId: number | null = null

  public constructor(
    private readonly registry: Registry<Tracer>,
  ) {
    const rmProm = (asyncId: number) => {
      const stack = this.stacks.get(asyncId)
      if (!stack) return
      this.stacks.delete(asyncId)
      this.parents.delete(asyncId)
    }
    this.hook = createHook({
      init: (asyncId, _type, triggerAsyncId) => {
        if (!this.parents.has(triggerAsyncId)) return
        this.parents.add(asyncId)
        const { stack = '???' } = new Error()
        this.stacks.set(asyncId, { id: asyncId, parent: triggerAsyncId, stack })
      },
      destroy: rmProm,
      promiseResolve: rmProm,
      after: rmProm,
    })
  }

  /**
   * Execute a provided asynchronous job, tracking the execution context and
   * storing the stack trace for each unsettled promise. The `Tracer` is added
   * to the `Registry` before the job is executed, and removed from the
   * `registry` after the job completes -- all done by `run` itself.
   *
   * @param job the asynchronous job to execute.
   * @returns the result of the job.
   */
  public async run<T>(job: () => Promise<T>) {
    this.registry.add(this)
    this.hook.enable()
    await Promise.resolve()
    this.rootAsyncId = executionAsyncId()
    this.parents.add(this.rootAsyncId)
    try {
      return await job()
    } finally {
      this.hook.disable()
      this.registry.delete(this)
    }
  }
}
