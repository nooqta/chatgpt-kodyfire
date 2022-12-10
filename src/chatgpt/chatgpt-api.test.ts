import test from 'ava'
import dotenv from 'dotenv-safe'

import { ChatGPTAPI } from './chatgpt-api'

dotenv.config()

const isCI = !!process.env.CI

test('ChatGPTAPI invalid session token', async (t: { timeout: (arg0: number) => void; throws: (arg0: () => ChatGPTAPI, arg1: { message: string }) => void; throwsAsync: (arg0: () => Promise<void>, arg1: { message: string }) => any }) => {
  t.timeout(30 * 1000) // 30 seconds

  t.throws(() => new ChatGPTAPI({ sessionToken: '' }), {
    message: 'ChatGPT invalid session token'
  })

  await t.throwsAsync(
    async () => {
      const chatgpt = new ChatGPTAPI({ sessionToken: 'invalid' })
      await chatgpt.ensureAuth()
    },
    {
      message: 'ChatGPT failed to refresh auth token. Error: Unauthorized'
    }
  )
})

test('ChatGPTAPI valid session token', async (t: { timeout: (arg0: number) => void; notThrows: (arg0: () => ChatGPTAPI) => void; notThrowsAsync: (arg0: Promise<void>) => any; truthy: (arg0: string) => void; is: (arg0: string, arg1: string) => void }) => {
  if (!isCI) {
    t.timeout(2 * 60 * 1000) // 2 minutes
  }

  t.notThrows(
    () => new ChatGPTAPI({ sessionToken: 'fake valid session token' })
  )

  await t.notThrowsAsync(
    (async () => {
      const chatgpt = new ChatGPTAPI({
        sessionToken: process.env.SESSION_TOKEN || ''
      }) 

      // Don't make any real API calls using our session token if we're running on CI
      if (!isCI) {
        await chatgpt.ensureAuth()
        const response = await chatgpt.sendMessage('test')
        console.log('chatgpt response', response)

        t.truthy(response)
        t.is(typeof response, 'string')
      }
    })()
  )
})

if (!isCI) {
  test('ChatGPTAPI expired session token', async (t: { timeout: (arg0: number) => void; throwsAsync: (arg0: () => Promise<void>, arg1: { message: string }) => any }) => {
    t.timeout(30 * 1000) // 30 seconds
    const expiredSessionToken = process.env.TEST_EXPIRED_SESSION_TOKEN || ''

    await t.throwsAsync(
      async () => {
        const chatgpt = new ChatGPTAPI({ sessionToken: expiredSessionToken })
        await chatgpt.ensureAuth()
      },
      {
        message:
          'ChatGPT failed to refresh auth token. Error: session token may have expired'
      }
    )
  })
}

if (!isCI) {
  test('ChatGPTAPI timeout', async (t: { timeout: (arg0: number) => void; throwsAsync: (arg0: () => Promise<void>, arg1: { message: string }) => any }) => {
    t.timeout(30 * 1000) // 30 seconds

    await t.throwsAsync(
      async () => {
        const chatgpt = new ChatGPTAPI({
          sessionToken: process.env.SESSION_TOKEN || ''
        })

        await chatgpt.sendMessage('test', {
          timeoutMs: 1
        })
      },
      {
        message: 'ChatGPT timed out waiting for response'
      }
    )
  })

  test('ChatGPTAPI abort', async (t: { timeout: (arg0: number) => void; throwsAsync: (arg0: () => Promise<void>, arg1: { message: string }) => any }) => {
    t.timeout(30 * 1000) // 30 seconds

    await t.throwsAsync(
      async () => {
        const chatgpt = new ChatGPTAPI({
          sessionToken: process.env.SESSION_TOKEN || ''
        })

        const abortController = new AbortController()
        setTimeout(() => abortController.abort(), 10)

        await chatgpt.sendMessage('test', {
          abortSignal: abortController.signal
        })
      },
      {
        message: 'testing abort'
      }
    )
  })
}
