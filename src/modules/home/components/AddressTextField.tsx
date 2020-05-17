import React from 'react';
import MuiTextField from '@material-ui/core/TextField';
import { fieldToTextField, TextFieldProps } from 'formik-material-ui';

type AddressTextFieldProps = TextFieldProps & {
  defaulterror?: string;
};

/**
 * Special TextField to allow showing a defaultError message
 * and clear the defaultError message when the value of the textfield is changed.
 *
 */
export const AddressTextField: React.FC<AddressTextFieldProps> = (
  props: AddressTextFieldProps
) => {
  const {
    form: { setFieldValue },
    field: { name },
  } = props;

  const [error, setError] = React.useState(props.defaulterror);

  React.useEffect(() => {
    setError(props.defaulterror);
  }, [props.defaulterror]);

  const onChange = React.useCallback(
    event => {
      const { value } = event.target;
      setFieldValue(name, value);
      if (error) {
        setError('');
      }
    },
    [setFieldValue, name, error]
  );

  return (
    <MuiTextField
      {...fieldToTextField(props)}
      onChange={onChange}
      error={!!error}
      helperText={error}
    />
  );
};
