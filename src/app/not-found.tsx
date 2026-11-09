import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { buttonStyles } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <EmptyState
      title="Page not found"
      description="That page doesn't exist. Head back to your overview."
      action={
        <Link href="/" className={buttonStyles("primary")}>
          Go to overview
        </Link>
      }
    />
  );
}
