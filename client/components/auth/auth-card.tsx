"use client";

import Link from "next/link";

import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";

const AuthCard = () => {
  const { loginWithGoogle } = useAuthStore();

  const handleGoogleAuth = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Google auth failed:", error);
    }
  };

  return (
    <div className="w-full max-w-sm px-4 sm:max-w-md sm:px-6">
      <div className="rounded-2xl p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl">
            Welcome to Nimbus
          </h1>
          <p className="text-sm text-zinc-400 sm:text-base">
            Your AI-powered travel companion
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Button
            onClick={handleGoogleAuth}
            className="w-full cursor-pointer rounded-xl bg-white py-5 font-medium text-black hover:bg-gray-100 sm:py-6"
          >
            <FcGoogle className="mr-3 h-5 w-5" />
            Continue with Google
          </Button>

          <p className="mt-6 text-center text-xs text-zinc-500">
            By continuing, you agree to our{" "}
            <Link href="#" className="text-white underline hover:text-gray-300">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-white underline hover:text-gray-300">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
