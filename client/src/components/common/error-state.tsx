import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  code: string;
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
  icon?: React.ReactNode;
}

export default function ErrorState({
  code,
  title,
  description,
  buttonText = "Go Home",
  buttonLink = "/",
  icon,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      {icon}

      <h1 className="mt-6 text-5xl font-bold">{code}</h1>

      <h2 className="mt-4 text-2xl font-semibold">{title}</h2>

      <p className="mt-3 max-w-md text-muted-foreground">{description}</p>

      <Button asChild className="mt-8">
        <Link to={buttonLink}>{buttonText}</Link>
      </Button>
    </div>
  );
}
