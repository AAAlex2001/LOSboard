"use client";

import { Input } from "@/src/shared/ui/Input";
import { Button } from "@/src/shared/ui/Button";
import { useLogin } from "../model/useLogin";
import { useState } from "react";
import { Loader } from "@/src/shared/ui/Loader";


export function LoginForm() {
  const { loading, error, performLogin } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    performLogin(email, password);
  };

    return (
      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <Button type="submit" disabled={loading}>
          {loading ? <Loader /> : "Login"}
        </Button>
        {error && <p>{error}</p>}
      </form>
    );
}