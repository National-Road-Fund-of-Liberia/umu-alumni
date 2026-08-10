"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { FieldWrapper } from "@/components/common/form/field-wrapper";
import { SubmitButton } from "@/components/common/form/submit-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { loginSchema, type LoginFormValues } from "@/schemas/auth";

export function LoginForm({ redirectTo = "/admin" }: { redirectTo?: string }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "", rememberMe: false },
  });

  async function onSubmit(values: LoginFormValues) {
    setFormError(null);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const result = await response.json();

    if (!result.success) {
      setFormError(result.error?.message ?? "Something went wrong. Please try again.");
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        {formError && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" aria-hidden="true" />
            <AlertTitle>Sign in failed</AlertTitle>
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        <FieldWrapper label="Username" htmlFor="username" error={errors.username} required>
          <Input
            id="username"
            autoComplete="username"
            autoFocus
            aria-invalid={!!errors.username}
            {...register("username")}
          />
        </FieldWrapper>

        <FieldWrapper label="Password" htmlFor="password" error={errors.password} required>
          <InputGroup>
            <InputGroupInput
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="button"
                size="icon-sm"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </FieldWrapper>

        <Controller
          control={control}
          name="rememberMe"
          render={({ field }) => (
            <Field orientation="horizontal">
              <Checkbox
                id="rememberMe"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
              />
              <FieldLabel htmlFor="rememberMe" className="font-normal">
                Remember me for 30 days
              </FieldLabel>
            </Field>
          )}
        />

        <SubmitButton isSubmitting={isSubmitting} submittingLabel="Signing in…" size="lg" className="w-full">
          Sign In
        </SubmitButton>
      </FieldGroup>
    </form>
  );
}
