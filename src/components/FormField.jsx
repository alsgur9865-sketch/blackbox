export default function FormField({ label, type = 'text', value, onChange, placeholder, autoComplete, ...props }) {
  return (
    <label className="form-field">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        {...props}
      />
    </label>
  );
}
