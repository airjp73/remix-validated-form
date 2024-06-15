import { useForm } from "@rvf/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/ui/button";
import { Input } from "~/ui/input";
import { Label } from "~/ui/label";
import { signUp } from "../simple-form/api";
import { showToastMessage } from "~/lib/utils";
import { withZod } from "@rvf/zod";
import { z } from "zod";
import { ErrorMessage } from "~/fields/ErrorMessage";

const validator = withZod(
  z
    .object({
      username: z.string(),
      password: z.string(),
      confirmPassword: z.string(),
    })
    .superRefine((value, ctx) => {
      if (value.password !== value.confirmPassword)
        ctx.addIssue({
          code: "custom",
          path: ["confirmPassword"],
          message: "Passwords must match",
        });
    }),
);

export const SignupForm = () => {
  const confirmRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    validator,
    resetAfterSubmit: true,
    handleSubmit: async ({ username, password }) => {
      await signUp({ username, password });
      showToastMessage("Account created!");
    },
  });

  return (
    <form {...form.getFormProps()}>
      <h3>Create an account</h3>

      <Label>
        Username
        <Input name="username" required />
      </Label>

      <Label>
        Password
        <Input id="password" name="password" required type="password" />
      </Label>

      <div>
        <Label>
          Confirm password
          <Input
            name="confirmPassword"
            required
            type="password"
            ref={confirmRef}
          />
        </Label>
        {form.error("confirmPassword") && (
          <ErrorMessage>{form.error("confirmPassword")}</ErrorMessage>
        )}
      </div>

      <Button type="submit" isLoading={form.formState.isSubmitting}>
        Submit
      </Button>
    </form>
  );
};
