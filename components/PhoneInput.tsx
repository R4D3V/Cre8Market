import type { InputHTMLAttributes } from "react";

const UG_PREFIX = "256";

export function toLocalPart(full: string): string {
  return (full || "").replace(/^\+?256/, "");
}

export function toFullNumber(local: string): string {
  return UG_PREFIX + (local || "").replace(/^0+/, "");
}

type PhoneInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange"
> & {
  value: string;
  onChange: (v: string) => void;
  outerClassName?: string;
};

export function PhoneInput({
  value,
  onChange,
  outerClassName = "",
  ...props
}: PhoneInputProps) {
  return (
    <div
      className={`neu-inset flex w-full items-center overflow-hidden ${outerClassName}`}
    >
      <span className="select-none pl-3 text-sm font-semibold text-muted-foreground">
        +256
      </span>
      <input
        {...props}
        type="tel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent px-2 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
      />
    </div>
  );
}
