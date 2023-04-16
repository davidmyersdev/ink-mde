import { type Thenable } from '/src/utils/inspect'

export type Awaitable<T> = () => Promise<T>
export type AwaitableCallbacks = { fulfilled: AwaitableCallback[], rejected: AwaitableCallback[], settled: AwaitableCallback[] }
export type AwaitableSettler<T = any> = (value: T) => void
export type AwaitableThenSettler<T = any, R = any> = (value: T) => R | Thenable<R>
export type AwaitableCallback = () => void
export type AwaitableHandler<ResolvedValue = unknown, RejectedValue = unknown> = (resolve: AwaitableSettler<ResolvedValue>, reject: AwaitableSettler<RejectedValue>) => any
export type AwaitableState = { callbacks: AwaitableCallbacks, error?: any, status: AwaitableStatus, value?: any }
export type AwaitableStatus = 'fulfilled' | 'pending' | 'rejected'

// Todo: Make it so that it allows 2 values to be returned: first one for initial return object (merged with awaitable), second one for resolved object (defaults to the first)
export const awaitable = <InitialValue extends object, ResolvedValue = InitialValue, RejectedValue = unknown>(initialValue: InitialValue, handler: AwaitableHandler<ResolvedValue, RejectedValue>): InitialValue & Promise<ResolvedValue> => {
  const state: AwaitableState = {
    callbacks: {
      fulfilled: [],
      rejected: [],
      settled: [],
    },
    status: 'pending',
  }

  const callback = (settler: AwaitableThenSettler, { resolve, reject }: { reject: AwaitableSettler, resolve?: AwaitableSettler }) => {
    return () => {
      try {
        const settledValue = settler(state.value)

        Promise.resolve(settledValue).then(resolve, reject)
      } catch (error: any) {
        reject(error)
      }
    }
  }

  const reject = (value: RejectedValue) => {
    if (state.status === 'pending') {
      state.status = 'rejected'
      state.value = value

      state.callbacks.rejected.forEach(callback => callback())
      state.callbacks.settled.forEach(callback => callback())
    }
  }

  const resolve = (value: ResolvedValue) => {
    if (state.status === 'pending') {
      state.status = 'fulfilled'
      state.value = value

      state.callbacks.fulfilled.forEach(callback => callback())
      state.callbacks.settled.forEach(callback => callback())
    }
  }

  const then = <OnFulfilled extends AwaitableThenSettler, OnRejected extends AwaitableThenSettler>(onFulfilled?: OnFulfilled, onRejected?: OnRejected) => {
    return new Promise<ReturnType<Awaited<OnFulfilled>>>((resolve, reject) => {
      if (state.status === 'pending') {
        if (onFulfilled) {
          state.callbacks.fulfilled.push(callback(onFulfilled, { resolve, reject }))
        }

        if (onRejected) {
          state.callbacks.rejected.push(callback(onRejected, { resolve: undefined, reject }))
        }
      }

      if (state.status === 'fulfilled' && onFulfilled) {
        callback(onFulfilled, { resolve, reject })()
      }

      if (state.status === 'rejected' && onRejected) {
        callback(onRejected, { resolve: undefined, reject })()
      }
    })
  }

  queueMicrotask(() => {
    try {
      handler(resolve, reject)
    } catch (error: any) {
      reject(error)
    }
  })

  return {
    ...initialValue,
    [Symbol.toStringTag]: 'awaitable',
    catch: then.bind(undefined, undefined),
    finally: (onSettled: () => void) => {
      return new Promise((resolve, reject) => {
        if (state.status === 'pending') {
          state.callbacks.settled.push(callback(onSettled, { resolve, reject }))
        }

        if (state.status === 'fulfilled') {
          onSettled()
          resolve(state.value)
        }

        if (state.status === 'rejected') {
          onSettled()
          reject(state.value)
        }
      })
    },
    then,
  }
}
