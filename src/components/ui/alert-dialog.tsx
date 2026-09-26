import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import * as React from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

export function AlertDialogContent({
  className,
  title,
  description,
  confirmLabel = "Delete",
  onConfirm,
}: {
  className?: string;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
}) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Overlay className="fixed inset-0 z-50 bg-bg/80" />
      <AlertDialogPrimitive.Content
        className={cn(
          "fixed z-50 left-1/2 top-1/2 w-[min(100%-1.5rem,26rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-surface p-5",
          className,
        )}
      >
        <AlertDialogPrimitive.Title className="font-display text-xl text-fg">
          {title}
        </AlertDialogPrimitive.Title>
        <AlertDialogPrimitive.Description className="mt-2 text-sm text-muted">
          {description}
        </AlertDialogPrimitive.Description>
        <div className="mt-5 flex justify-end gap-2">
          <AlertDialogPrimitive.Cancel asChild>
            <Button variant="secondary">Cancel</Button>
          </AlertDialogPrimitive.Cancel>
          <AlertDialogPrimitive.Action asChild>
            <Button variant="danger" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </AlertDialogPrimitive.Action>
        </div>
      </AlertDialogPrimitive.Content>
    </AlertDialogPrimitive.Portal>
  );
}
