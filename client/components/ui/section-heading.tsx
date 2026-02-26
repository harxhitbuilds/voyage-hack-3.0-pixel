import { cn } from "@/lib/utils";

interface SectionHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  heading: string;
  subheading?: string;
  alignment?: "left" | "center" | "right";
}

export const SectionHeading = ({
  heading,
  subheading,
  alignment = "left",
  className,
  ...props
}: SectionHeadingProps) => {
  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div className={cn("space-y-2", alignmentClasses[alignment], className)}>
      <h2
        className="text-foreground text-2xl font-bold tracking-tight md:text-3xl"
        {...props}
      >
        {heading}
      </h2>
      {subheading && (
        <p className="text-muted-foreground text-sm font-medium">
          {subheading}
        </p>
      )}
    </div>
  );
};
