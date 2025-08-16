import { setTimeout } from 'timers/promises'
import { describe, expect, it } from 'vitest'
import { testCaseAlternativeNesting, testCaseDeepNesting } from './test-cases'
import Tracer from './Tracer'

describe('Tracer', () => {
  it(
    'should only keep the frames of running async functions',
    { repeats: 10, concurrent: true },
    async () => {
      const registry = new Set<Tracer>()
      const tracer = new Tracer(registry)
      void tracer.run(testCaseDeepNesting)
      await setTimeout(1000)
      const frames = [...tracer.stacks.values()]
      expect(frames.find(frame =>
        frame.stack.includes('triggerBadFunction')
        || frame.stack.includes('badAsyncFunction'))).toBeTruthy()
      expect(frames.find(frame =>
        frame.stack.includes('goodAsyncFunction'))).toBeFalsy()
    },
  )

  it('should be able to handle independent async functions', {
    repeats: 10,
    concurrent: true,
  },
  async () => {
    const registry0 = new Set<Tracer>()
    const tracer0 = new Tracer(registry0)
    const registry1 = new Set<Tracer>()
    const tracer1 = new Tracer(registry1)
    void Promise.all([
      tracer0.run(testCaseDeepNesting),
      tracer1.run(testCaseAlternativeNesting),
    ])
    await setTimeout(1000)
    const frames0 = [...tracer0.stacks.values()]
    expect(frames0.find(frame =>
      frame.stack.includes('triggerBadFunction')
      || frame.stack.includes('badAsyncFunction'))).toBeTruthy()
    expect(frames0.find(frame =>
      frame.stack.includes('goodAsyncFunction'))).toBeFalsy()
    expect(frames0.find(frame =>
      frame.stack.includes('intermediateOperation')
      || frame.stack.includes('slowAsyncOperation')
      || frame.stack.includes('fastAsyncOperation'))).toBeFalsy()

    const frames1 = [...tracer1.stacks.values()]
    expect(frames1.find(frame =>
      frame.stack.includes('intermediateOperation')
      || frame.stack.includes('slowAsyncOperation'))).toBeTruthy()
    expect(frames1.find(frame =>
      frame.stack.includes('fastAsyncOperation'))).toBeFalsy()
    expect(frames1.find(frame =>
      frame.stack.includes('triggerBadFunction')
      || frame.stack.includes('badAsyncFunction')
      || frame.stack.includes('goodAsyncFunction'))).toBeFalsy()
  })
})
