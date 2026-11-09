/**
 * Service configuration.
 *
 * FUTURE API: `apiBaseUrl` is intentionally UNUSED today. When a backend exists,
 * set NEXT_PUBLIC_API_BASE_URL and replace the mock bodies in the *Service.ts
 * files with fetch calls — no component needs to change.
 */
export const config = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
  useMock: process.env.NEXT_PUBLIC_USE_MOCK !== "false",
  mockDelayMs: Number(process.env.NEXT_PUBLIC_MOCK_DELAY_MS ?? 450),
  mockFailureRate: Number(process.env.NEXT_PUBLIC_MOCK_FAILURE_RATE ?? 0),
} as const;
