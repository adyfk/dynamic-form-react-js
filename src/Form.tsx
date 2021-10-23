import { useEffect, useRef, useState } from 'react';
import { useEffectOnce } from 'react-use';
import { Container, Dropdown, Input } from './input';

// Base validator
const VBase = {
  // abstract
  validateCase(values, fieldName, config) {
    return false;
  },
  validate(values, fieldName, config) {
    const isValid = this.validateCase(values, fieldName, config);
    if (!isValid) return config.error;

    return false;
  },
  equal: (value, equal) => value === equal,
  includes: (value, options) => options.includes(value),
};

// Number Validator
const VNumber = {
  ...VBase,
  validateCase(values, fieldName, config) {
    const value = values[fieldName];

    if ('min' in config) return this.min(+value, +config.min);
    else if ('max' in config) return this.max(+value, +config.max);
    else if ('equal' in config) return this.equal(+value, +config.equal);
    else if ('includes' in config)
      return this.includes(+value, config.includes);

    return true;
  },
  min: (val, min) => val >= min,
  max: (val, max) => val <= max,
};

// String Validator
const VString = {
  ...VBase,
  validateCase(values, fieldName, config) {
    const value = values[fieldName];

    if ('equal' in config) return this.equal(value, config.equal);
    else if ('includes' in config) return this.includes(value, config.includes);
    return true;
  },
};

// When Validator
const VWhen = {
  validate(values, fieldName, config) {
    const { refer } = config;

    if ('case' in config) {
      const selectedConfig = config.case[values[refer]];

      // if value not in case
      if (!selectedConfig) return true;
      return validationGate(values, fieldName, selectedConfig);
    }

    return false;
  },
};

function validationGate(values, fieldName, config) {
  const { type } = config;

  switch (type) {
    case 'number':
      return VNumber.validate(values, fieldName, config);
    case 'string':
      return VString.validate(values, fieldName, config);
    case 'when':
      return VWhen.validate(values, fieldName, config);
  }
  return false;
}

function Form({ formFields }) {
  const validator = useRef<any>(null);
  const overrider = useRef<any>(null);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // console.log({ values, errors, touched, overrider });

  const onOverrideValue = async (field, value) => {
    const newValues = { ...values };
    const override = overrider.current[field];
    if (override && override.case[value]) {
      const overrideValues = override.case[value];
      Object.assign(newValues, overrideValues);
      setValues(newValues);
    }
  };

  const onChangeValues = (field: string) => (value) => {
    // check-override another-value / not [async for allow non-blocking]
    onOverrideValue(field, value);

    setTouched((prev) => ({ ...prev, [field]: true }));
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const onValidate = () => {
    const errors = {};
    Object.entries(validator.current).forEach(
      ([fieldName, rules = []]: any) => {
        for (let index = 0; index < rules.length; index++) {
          const error = validationGate(values, fieldName, rules[index]);
          if (error) {
            errors[fieldName] = error;
            break;
          }
        }
      }
    );
    setErrors(errors);
  };

  useEffectOnce(() => {
    validator.current = {};
    overrider.current = {};

    formFields.forEach(({ fieldName, rules, assign }) => {
      validator.current[fieldName] = rules;

      if (!assign) return;
      overrider.current[fieldName] = assign;
    });
  });

  useEffect(() => {
    if (!validator.current) return;

    onValidate();
  }, [values]);

  return (
    <div className="Form">
      {formFields.map(
        ({ fieldType, label, fieldName, valueType, options }, index) => {
          switch (fieldType) {
            case 'text': {
              return (
                <Container
                  error={touched[fieldName] && errors[fieldName]}
                  label={label}
                  key={index}
                >
                  <Input
                    placeholder="input"
                    onChange={onChangeValues(fieldName)}
                    value={values[fieldName] || ''}
                    type={valueType}
                  ></Input>
                </Container>
              );
            }
            case 'dropdown': {
              return (
                <Container
                  error={touched[fieldName] && errors[fieldName]}
                  label={label}
                  key={index}
                >
                  <Dropdown
                    placeholder="input"
                    id={fieldName}
                    options={options}
                    onChange={onChangeValues(fieldName)}
                    value={values[fieldName] || ''}
                    type={valueType}
                  ></Dropdown>
                </Container>
              );
            }
          }

          return null;
        }
      )}
    </div>
  );
}

export default Form;
