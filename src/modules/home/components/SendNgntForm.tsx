import React, { useCallback } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Formik, Field, Form, FormikHelpers } from 'formik';
import { TextField } from 'formik-material-ui';
import * as Yup from 'yup';
import { Ngnt } from './Ngnt';
import { AddressTextField } from './AddressTextField';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
  },
  formControl: {
    width: '100%',
  },
  submitButton: {
    height: '3.4rem',
  },
  buttonWrapper: {
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

const SendFormSchema = Yup.object().shape({
  recipientAddress: Yup.string().matches(
    // 0x address or ens domain regex
    /^(0x[a-fA-F0-9]{40})|(([a-zA-Z0-9][a-zA-Z0-9-_]*\.)*[a-zA-Z0-9]*[a-zA-Z0-9-_]*[[a-zA-Z0-9]+)$/i,
    "Should start with '0x' or be a ENS name"
  ),
  amount: Yup.number()
    .typeError('Amount must be a number')
    .positive('Valid amount not allowed'),
});

export interface NgntFormFieldValues {
  recipientAddress: string;
  amount: string;
}

interface SendNgntFormProps {
  visible: boolean;
  isSubmitting: boolean;
  recipientError?: string;
  onSubmit: (values: NgntFormFieldValues) => void;
}

export const SendNgntForm: React.FC<SendNgntFormProps> = ({
  visible,
  isSubmitting,
  recipientError,
  onSubmit,
}) => {
  const classes = useStyles();
  const handleSubmit = useCallback(
    (
      values: NgntFormFieldValues,
      formik: FormikHelpers<NgntFormFieldValues>
    ) => {
      let isError = false;
      if (!values.amount) {
        formik.setFieldError('amount', 'Amount to be sent is required');
        isError = true;
      }
      if (!values.recipientAddress) {
        formik.setFieldError(
          'recipientAddress',
          'Address or ENS name required'
        );
        isError = true;
      }

      if (!isError) {
        onSubmit(values);
      }
      formik.setSubmitting(false); // prevent fields from disabling
    },
    [onSubmit]
  );

  if (!visible) {
    return null;
  }

  return (
    <Formik
      key="send-ngnt-form"
      initialValues={{
        recipientAddress: '',
        amount: '',
      }}
      onSubmit={handleSubmit}
      validationSchema={SendFormSchema}
    >
      {(): JSX.Element => {
        return (
          <Paper elevation={3} className={classes.paper}>
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Field
                    id="amountField"
                    label="Amount (NGNT)"
                    name="amount"
                    // type="number"
                    component={TextField}
                    className={classes.formControl}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    id="recipientField"
                    label="Receipients 0x Address or ENS"
                    name="recipientAddress"
                    component={AddressTextField}
                    className={classes.formControl}
                    variant="outlined"
                    defaulterror={recipientError}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <div className={classes.buttonWrapper}>
                    <Button
                      fullWidth
                      className={classes.submitButton}
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                    >
                      SEND <Ngnt nolink />
                    </Button>
                    {isSubmitting && (
                      <CircularProgress
                        size={24}
                        className={classes.buttonProgress}
                      />
                    )}
                  </div>
                </Grid>
              </Grid>
            </Form>
          </Paper>
        );
      }}
    </Formik>
  );
};
