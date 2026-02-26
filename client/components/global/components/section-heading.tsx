import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  heading: string;
  className?: string;
}

const SectionHeading = ({ heading, className }: SectionHeadingProps) => {
  return (
    <h1 className={cn("text-2xl font-robert-medium font-bold", className)}>
      {heading}
    </h1>
  );
};

export default SectionHeading;
