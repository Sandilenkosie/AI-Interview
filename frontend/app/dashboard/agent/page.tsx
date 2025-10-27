"use client";

import {Agent} from '@/components/agent';
import { useUser } from "@stackframe/stack";

export default function Page() {
  const user = useUser();

  return (
    <>
      <h3>page</h3>
      <Agent userName={user?.displayName} userId={user?.id} type="generate"/>
    </>
  );
}
