import * as React from 'react';

import { TextField } from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField';
import { WrappedFieldProps } from 'redux-form';

/** Input (form用) */
const InputField: React.FC<WrappedFieldProps & TextFieldProps> = ({
  input,
  meta: { touched, error },
  ...props
}) => {
  const displayError = Boolean(touched && error);
  return (
    <TextField
      error={displayError}
      helperText={displayError ? error : ' '}
      {...input}
      fullWidth
      {...props}
    />
  );
};

export default InputField;
