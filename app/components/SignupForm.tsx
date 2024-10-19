"use client";
import React, { useState } from "react";
import Link from "next/link";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface SignUpFormProps {
  signUpWithEmail: ({
    emailAddress,
    password,
  }: {
    emailAddress: string;
    password: string;
  }) => void;
  clerkError: string;
}

const SignupForm = ({ signUpWithEmail, clerkError }: SignUpFormProps) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSignUpSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signUpWithEmail({ emailAddress: email, password });
  };

  return (
    <div className="w-full h-full justify-center mt-12 justify-items-center md:mt-20">
      <div className="border border-gray-500 rounded-3xl m-10 h-[100vh]">
        <div className="row h-full flex">
          <div className="w-[50%] col-6 h-full bg-black p-16 rounded-tl-3xl rounded-bl-3xl">
            <p className="text-white text-lg">Acme Inc</p>
            <p className="text-white text-lg mt-[450px]">
              “This library has saved me countless hours of work and helped me
              deliver stunning designs to my clients faster than ever before.”
              <br /> <span className="text-sm text-">Sofia Davis</span>
            </p>
          </div>

          <div className="w-[50%] col-6 p-20  border-none">
            <Link
              href="/sign-in"
              className=" text-black text-bold py-2 px-4 m-[530px] mt-[-40px]">
              Login
            </Link>
            <Card className="w-[450px] border-none p-8 bg-transparent m-8">
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  {step === 1 ? "Create an account" : "Enter a password"}
                </CardTitle>
                <CardDescription className="text-center">
                  {step === 1
                    ? "Enter your email below to start the sign-up process"
                    : "Now enter your password to create your account"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {step === 1 ? (
                  // Step 1: Email Form
                  <form onSubmit={handleEmailSubmit}>
                    <div className="grid w-full items-center gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <Input
                          id="email"
                          name="email"
                          placeholder="name@example.com"
                          className="w-full"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <Button className="w-full mt-4" type="submit">
                      Continue
                    </Button>
                  </form>
                ) : (
                  // Step 2: Password Form
                  <form onSubmit={handleSignUpSubmit}>
                    <div className="grid w-full items-center gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <Input
                          id="password"
                          name="password"
                          placeholder="password"
                          className="w-full"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        {clerkError && <p className="text-red">{clerkError}</p>}
                      </div>
                    </div>
                    <Button className="w-full mt-4" type="submit">
                      Sign Up
                    </Button>
                  </form>
                )}
              </CardContent>

              {step === 1 && (
                <>
                  <p className="w-full text-center text-gray-400 text-xs">
                    <span className="text-gray-400 text-sm text-center">
                      ----------------
                    </span>{" "}
                    OR CONTINUE WITH{" "}
                    <span className="text-gray-400">----------------</span>
                  </p>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" className="w-full mt-5">
                      <GitHubLogoIcon /> Github
                    </Button>
                  </CardFooter>
                </>
              )}

              <p className="text-sm text-center text-gray-400 mt-5">
                By clicking continue, you agree to our{" "}
                <a href="/" className="underline">
                  Terms <br /> of Service
                </a>{" "}
                and{" "}
                <a href="" className="underline">
                  Privacy Policy
                </a>
                .
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
