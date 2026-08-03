const UG_PREFIX = "256";

export function toLocalPart(full: string): string {
  return (full || "").replace(/^\+?256/, "");
}

export function toFullNumber(local: string): string {
  return UG_PREFIX + (local || "").replace(/^0+/, "");
}

export function PhoneInput({
  value,
  onChange,
  required,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="neu-inset flex items-center w-full overflow-hidden">
      <span className="pl-3 text-sm font-semibold text-gray-500 select-none">+256</span>
      <input
        required={required}
        type="tel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent px-2 py-2 text-sm focus:outline-none"
      />
    </div>
  );
}
