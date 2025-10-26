import "server-only";

import { StackServerApp } from "@stackframe/stack";
import { stackClientApp } from "./client";

// Only initialize the server-side Stack app when the project ID is provided.
// This prevents Next.js build-time collection from failing when the
// NEXT_PUBLIC_STACK_PROJECT_ID environment variable is not set (e.g. in
// preview builds or before the deploy environment is configured).
export const stackServerApp =
  process.env.NEXT_PUBLIC_STACK_PROJECT_ID && process.env.NEXT_PUBLIC_STACK_PROJECT_ID.length > 0
    ? new StackServerApp({
        // `stackClientApp` is only undefined when NEXT_PUBLIC_STACK_PROJECT_ID is
        // not set. We check the environment variable above, so assert non-null
        // here to satisfy the constructor's type expectations.
        inheritsFrom: stackClientApp!,
      })
    : undefined;

// Note: callers should handle the possibility that `stackServerApp` is undefined.
