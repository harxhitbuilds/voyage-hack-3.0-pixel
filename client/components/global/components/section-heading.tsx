import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  heading: string;
  className?: string;
}

const SectionHeading = ({ heading, className }: SectionHeadingProps) => {
  return (
    <h1 className={cn("font-robert-medium text-2xl font-bold", className)}>
      {heading}
    </h1>
  );
};

export default SectionHeading;
