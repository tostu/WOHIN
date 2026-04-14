import { createAuthClient } from "better-auth/react";
import { expoStore } from "@better-auth/expo";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "@/constants/config";

export const authClient = createAuthClient({
  baseURL: API_URL,
  plugins: [expoStore(SecureStore)],
});

export const { signIn, signUp, signOut, useSession } = authClient;
