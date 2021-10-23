export const Input = ({ value, onChange, ...rest }) => {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      {...rest}
    ></input>
  );
};

export type TOption = { value: string; label: string };

export const Dropdown = ({ value, onChange, options = [], ...rest }: any) => {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} {...rest}>
      {options.map((option: TOption | string) => {
        const optionValue = (option as TOption)?.value ?? option;
        const optionLabel = (option as TOption)?.label ?? option;
        return (
          <option key={optionValue + optionLabel + rest.id} value={optionValue}>
            {optionLabel}
          </option>
        );
      })}
    </select>
  );
};

export const Checkbox = ({ value = [], onChange, options = [], ...rest }) => {
  return (
    <div>
      {options.map((option: TOption | string) => {
        const optionValue = (option as TOption)?.value ?? option;
        const optionLabel = (option as TOption)?.label ?? option;
        const checked = (value as string[]).includes(optionValue);

        return (
          <div>
            <input
              type="checkbox"
              checked={checked}
              onChange={() => {
                if (checked) {
                  onChange(
                    value.filter(
                      (selectedOption) => selectedOption !== optionValue
                    )
                  );
                } else {
                  onChange([...value, optionValue]);
                }
              }}
              {...rest}
            />
            {optionLabel}
          </div>
        );
      })}
    </div>
  );
};

export const Container = ({ label, error, children }) => {
  return (
    <div>
      <div>{label}</div>
      {children}
      <div style={{ color: 'red' }}>{error}</div>
    </div>
  );
};
