import { describe, it, expect } from 'vitest'
import Tracer from './Tracer'
import { setTimeout } from 'timers/promises'
import { testCaseDeepNesting } from './test-cases'

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
})
