const menuPortalTarget =
  typeof document !== "undefined" ? document.body : null;

const baseSelectProps = {
  menuPortalTarget,
  menuPosition: "fixed",
};

export const darkSelectStyles = {
  control: (base, state) => ({
    ...base,
    background: "rgba(255, 255, 255, 0.08)",
    borderColor: state.isFocused ? "#e8a838" : "rgba(255, 255, 255, 0.15)",
    boxShadow: state.isFocused ? "0 0 0 1px #e8a838" : "none",
    borderRadius: "8px",
    minHeight: "38px",
    "&:hover": { borderColor: "#e8a838" },
  }),
  menu: (base) => ({
    ...base,
    background: "#1e1e52",
    border: "1px solid rgba(232, 168, 56, 0.35)",
    borderRadius: "8px",
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  option: (base, state) => ({
    ...base,
    background: state.isFocused ? "rgba(232, 168, 56, 0.15)" : "transparent",
    color: "#f0f0f8",
    cursor: "pointer",
  }),
  multiValue: (base) => ({
    ...base,
    background: "rgba(232, 168, 56, 0.2)",
    borderRadius: "6px",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#f5d78e",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#e8a838",
    "&:hover": { background: "rgba(232, 168, 56, 0.3)", color: "#fff" },
  }),
  input: (base) => ({ ...base, color: "#f0f0f8" }),
  placeholder: (base) => ({ ...base, color: "#a8a8c8" }),
  singleValue: (base) => ({ ...base, color: "#f0f0f8" }),
};

export const lightSelectStyles = {
  control: (base, state) => ({
    ...base,
    background: "#fff",
    borderColor: state.isFocused ? "#e8a838" : "rgba(0, 0, 0, 0.15)",
    boxShadow: state.isFocused ? "0 0 0 1px #e8a838" : "none",
    borderRadius: "8px",
    minHeight: "38px",
    "&:hover": { borderColor: "#e8a838" },
  }),
  menu: (base) => ({
    ...base,
    background: "#fff",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  option: (base, state) => ({
    ...base,
    background: state.isFocused ? "rgba(232, 168, 56, 0.12)" : "transparent",
    color: "#1a1a3a",
    cursor: "pointer",
  }),
  multiValue: (base) => ({
    ...base,
    background: "rgba(232, 168, 56, 0.15)",
    borderRadius: "6px",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#1a1a3a",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#e8a838",
    "&:hover": { background: "rgba(232, 168, 56, 0.25)", color: "#1a1a3a" },
  }),
  input: (base) => ({ ...base, color: "#1a1a3a" }),
  placeholder: (base) => ({ ...base, color: "#888" }),
  singleValue: (base) => ({ ...base, color: "#1a1a3a" }),
};

export const darkSelectProps = {
  ...baseSelectProps,
  styles: darkSelectStyles,
};

export const lightSelectProps = {
  ...baseSelectProps,
  styles: lightSelectStyles,
};
