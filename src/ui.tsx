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

export const Select = ({
  className,
  ...props
}: React.HTMLProps<HTMLSelectElement>) => (
  <select className={`border p-1 px-0.5 rounded ${className}`} {...props} />
);

