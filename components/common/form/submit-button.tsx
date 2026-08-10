import { Loader2 } from "lucide-react";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";

interface SubmitButtonProps extends ComponentProps<typeof Button> {
  isSubmitting: boolean;
  submittingLabel?: string;
}

export function SubmitButton({
  isSubmitting,
  submittingLabel = "Saving…",
  children,
  disabled,
  ...props
}: SubmitButtonProps) {
  return (
    <Button type="submit" disabled={isSubmitting || disabled} {...props}>
      {isSubmitting ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          {submittingLabel}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
