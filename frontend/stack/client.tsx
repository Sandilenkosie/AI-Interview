import { StackClientApp } from "@stackframe/stack";

// Only initialize the client app when the public project ID is provided.
// NEXT_PUBLIC_* env vars are inlined at build time by Next.js.
export const stackClientApp =
  process.env.NEXT_PUBLIC_STACK_PROJECT_ID && process.env.NEXT_PUBLIC_STACK_PROJECT_ID.length > 0
    ? new StackClientApp({
        tokenStore: "nextjs-cookie",
      })
    : undefined;

// Note: consumers should handle that `stackClientApp` may be undefined when
// the environment variable isn't set (e.g. local dev without config or preview builds).
