"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function loginAction(_prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
    return { ok: true, error: null };
  } catch (error) {
    if (error instanceof AuthError) {
      // Credenciais inválidas ou erro do provider
      if (error.type === "CredentialsSignin") {
        return { ok: false, error: "Email ou senha inválidos." };
      }
    }
    return { ok: false, error: "Não foi possível entrar. Tente novamente." };
  }
}
