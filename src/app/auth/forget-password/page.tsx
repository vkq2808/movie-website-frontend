"use client";
import { authApi } from "@/apis/auth.api";
import { useRouter } from "next/navigation";
import React from "react";
import { ClipLoader } from "react-spinners";
import { useToast } from "@/hooks/useToast";

const ForgetPasswordPage = () => {
  const toast = useToast();
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState("");
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const validateData = () => {
    if (!email) {
      setError("Email is required");
      toast.warning("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Invalid email");
      toast.warning("Invalid email");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    if (!validateData()) return;
    setLoading(true);

    setTimeout(() => {
      authApi
        .forgetPassword({ email })
        .then((res) => {
          if (res.success) {
            toast.success("OTP sent successfully");
            router.push("/auth/reset-password?email=" + email);
          } else {
            toast.error(res.message || "Could not send OTP");
          }
        })
        .catch((error) => {
          const msg = error?.response?.data?.message || "Could not send OTP";
          setError(msg);
          toast.error(msg);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 300);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <div className="bg-slate-100 p-8 rounded-lg shadow-md w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700">
              Email
            </label>
            <input
              type="email"
              className="w-full text-gray-800 px-4 py-2 mt-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {error && <div className="text-sm text-red-500">{error}</div>}
          <button
            type="submit"
            className="w-full px-4 py-2 mt-4 text-sm font-medium text-neutral-50 bg-blue-500 rounded-lg focus:outline-none hover:bg-blue-600"
          >
            {loading ? (
              <ClipLoader color="#fff" loading={loading} size={20} />
            ) : (
              "Send OTP"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPasswordPage;
