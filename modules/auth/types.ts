export type SessionUser = {
  id: string;
  email: string | null;
};

/** Estado que devuelven las actions de auth a `useActionState`. */
export type AuthState = { error?: string; message?: string } | null;
