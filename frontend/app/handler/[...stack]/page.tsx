import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "../../../stack/server";

export default function Handler(props: unknown) {
  // When `NEXT_PUBLIC_STACK_PROJECT_ID` isn't set we intentionally don't
  // initialize the server Stack app. In that case, render nothing so the
  // build and pages that reference this route won't fail. Consumers relying
  // on Stack features should ensure the env var is set in their deploy env.
  if (!stackServerApp) return null;

  return <StackHandler fullPage app={stackServerApp} routeProps={props} />;
}
