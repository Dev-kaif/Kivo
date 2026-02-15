"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            await api.post("/auth/login", {
                email,
                password,
            });

            // Cookie is set automatically by backend
            router.push("/dashboard");

        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed");
            console.log(err)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm space-y-4 rounded-lg border p-6 shadow-sm"
            >
                <h1 className="text-xl font-semibold">Login</h1>

                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}

                <div className="space-y-2">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full rounded-md border px-3 py-2"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full rounded-md border px-3 py-2"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-md bg-black py-2 text-white disabled:opacity-50"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}
