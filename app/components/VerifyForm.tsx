"use client";
import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface VerifyFormProps {
  handleVerify: (e: FormEvent) => void;
  code: string;
  setCode: (value: string) => void;
}

const VerifyForm = ({ handleVerify, code, setCode }: VerifyFormProps) => {
  return (
    <div className="w-full h-full justify-center mt-12 justify-items-center md:mt-20">
      <div className="border border-gray-500 rounded-3xl m-10 h-[100vh]">
        <div className="row h-full flex">
          <div className="w-[50%] col-6 h-full bg-black rounded-tl-3xl rounded-bl-3xl"></div>

          <div className="w-[50%] col-6 flex items-center justify-center border-none">
            <Card className="w-[450px] border-none p-8 bg-transparent">
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  Verification Code
                </CardTitle>
                <CardDescription className="text-center">
                  Enter your Verification Code below to complete the sign-up
                  process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVerify}>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Input
                        id="code"
                        name="code"
                        value={code}
                        placeholder="code"
                        className="w-full"
                        onChange={(e) => setCode(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button className="w-full mt-4" type="submit">
                    Continue
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyForm;
