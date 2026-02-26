"use client";

import Link from "next/link";

import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button";
import {
  auth,
  provider,
  signInWithPopup,
} from "@/configurations/firebase.config";
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
    <div className="mr-12">
      <div className="relative z-10 mx-auto w-full max-w-md px-6">
        <div className="rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 text-center">
            <h1 className="font-inter font-robert-medium mb-2 text-3xl font-bold text-white">
              Welcome to Nimbus
            </h1>
            <p className="font-robert-regular text-zinc-400">
              Your AI-powered travel companion
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleGoogleAuth}
              className="cursor-pointe w-full cursor-pointer rounded-xl bg-white py-6 font-medium text-black hover:bg-gray-100"
            >
              <FcGoogle className="font-robert-regular mr-3 h-5 w-5" />
              Continue with Google
            </Button>

            <p className="font-robert-regular mt-6 text-center text-xs text-zinc-500">
              By continuing, you agree to our{" "}
              <Link
                href="#"
                className="text-white underline hover:text-gray-300"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="#"
                className="text-white underline hover:text-gray-300"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AuthCard;
