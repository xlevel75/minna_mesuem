/**
 * fetch with retries on transient failures. The upstream open APIs (KCISA via
 * api.kcisa.kr, TourAPI) are occasionally slow/unstable, which surfaces as an
 * intermittent 5xx (e.g. a 502 from the Vercel rewrite proxy). Retrying a
 * couple of times with a short backoff clears almost all of these.
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function fetchWithRetry(
  url: string,
  signal?: AbortSignal,
  retries = 2,
): Promise<Response> {
  let lastError: unknown
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { signal })
      // Retry transient upstream/gateway errors; return everything else.
      if (res.status >= 500 && attempt < retries) {
        await delay(500 * (attempt + 1))
        continue
      }
      return res
    } catch (e) {
      if (signal?.aborted) throw e
      lastError = e
      if (attempt < retries) {
        await delay(500 * (attempt + 1))
        continue
      }
    }
  }
  throw lastError instanceof Error ? lastError : new Error('request failed')
}
