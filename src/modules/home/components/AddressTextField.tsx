import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MuiTextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { fieldToTextField, TextFieldProps } from 'formik-material-ui';

import QrIcon from '../assets/qr.svg';

const useStyles = makeStyles({
  qrIcon: {
    width: '1em',
  },
});

type AddressTextFieldProps = TextFieldProps & {
  defaulterror?: string;
  onScanQrCodeClicked: () => void;
};

/**
 * Special TextField to allow showing a defaultError message
 * and clear the defaultError message when the value of the textfield is changed.
 *
 */
export const AddressTextField: React.FC<AddressTextFieldProps> = ({
  onScanQrCodeClicked,
  ...props
}: AddressTextFieldProps) => {
  const classes = useStyles();
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
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="Scan QR Code Button"
              onClick={onScanQrCodeClicked}
              edge="end"
            >
              <img
                src={QrIcon}
                className={classes.qrIcon}
                alt="scan QR code icon"
              />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
