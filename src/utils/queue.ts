export type Queue = ReturnType<typeof makeQueue>

export const makeQueue = () => {
  const state = {
    queue: <(() => Promise<void>)[]>[],
    workload: 0,
  }

  const process = async () => {
    const task = state.queue.pop()

    if (!task) return

    await task()

    state.workload--

    await process()
  }

  return {
    enqueue: (callback: () => void | Promise<void>): Promise<void> => {
      return new Promise((resolve, reject) => {
        const task = async () => {
          try {
            await callback()

            resolve()
          } catch (error) {
            reject(error)
          }
        }

        state.queue.push(task)
        state.workload++

        // If the queue has other items in it, then it will drain itself.
        if (state.workload > 1) return

        process()
      })
    },
  }
}
