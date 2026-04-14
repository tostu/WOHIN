import { API_URL } from "@/constants/config";
import { authClient } from "./auth";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_URL}${path}`;

    // Auto-inject session headers if available
    const session = await authClient.getSession();
    const headers = new Headers(options.headers);

    if (session?.data?.session?.token) {
        headers.set("Authorization", `Bearer ${session.data.session.token}`);
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || `Request failed with status ${response.status}`);
    }

    return response.json();
}

export const api = {
    get: <T>(path: string, options?: RequestInit) => request<T>(path, { ...options, method: 'GET' }),
    post: <T>(path: string, body: any, options?: RequestInit) => request<T>(path, {
        ...options,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...options?.headers },
        body: JSON.stringify(body)
    }),
};
