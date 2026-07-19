import { describe, expect, it } from 'vitest'
import { makeQueue } from '/src/utils/queue'

describe('queue', () => {
  it('processes queued work in insertion order', async () => {
    const queue = makeQueue()
    const calls: string[] = []
    let releaseFirst: () => void

    const first = queue.enqueue(async () => {
      calls.push('first:start')
      await new Promise<void>((resolve) => releaseFirst = resolve)
      calls.push('first:end')
    })
    const second = queue.enqueue(() => {
      calls.push('second')
    })
    const third = queue.enqueue(() => {
      calls.push('third')
    })

    releaseFirst!()
    await Promise.all([first, second, third])

    expect(calls).toEqual(['first:start', 'first:end', 'second', 'third'])
  })
})
