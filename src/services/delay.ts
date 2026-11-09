import { config } from "@/services/config";

/** Simulates network latency (and optional failure) for mock-backed services. */
export async function simulateLatency(): Promise<void> {
  const wait = config.mockDelayMs + Math.random() * 150;
  await new Promise((resolve) => setTimeout(resolve, wait));
  if (Math.random() < config.mockFailureRate) {
    throw new Error("Simulated network failure. Please try again.");
  }
}
