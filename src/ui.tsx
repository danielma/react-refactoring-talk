export const HStack = ({
  className,
  ...props
}: React.HTMLProps<HTMLDivElement>) => (
  <div className={`flex flex-row ${className}`} {...props} />
);
export const VStack = ({
  className,
  ...props
}: React.HTMLProps<HTMLDivElement>) => (
  <div className={`flex flex-col ${className}`} {...props} />
);

