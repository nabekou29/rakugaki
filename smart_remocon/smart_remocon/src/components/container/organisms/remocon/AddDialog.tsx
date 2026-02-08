import * as React from 'react';

import {
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Slide,
  Toolbar,
  Typography,
} from '@material-ui/core';
import {
  Field,
  FormSubmitHandler,
  InjectedFormProps,
  reduxForm,
} from 'redux-form';
import { closeAddDialog, registerSignal } from '../../../../actions/remocon';
import {
  createValidator,
  maxLength,
  required,
} from '../../../../utils/validation';

import { AppState } from '../../../../reducers';
import InputField from '../../../presentational/atoms/form/InputField';
import { TransitionProps } from '@material-ui/core/transitions/transition';
import { form } from '../../../../constants/form';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

interface FormData {
  name?: string;
}

// バリデーション
const validate = createValidator({
  name: [required, maxLength(20)],
});

const AddDialog: React.FC<InjectedFormProps> = (props: InjectedFormProps) => {
  const { handleSubmit, submitting, invalid } = props;
  const state = useSelector((app: AppState) => app.remocon);
  const dispatch = useDispatch();

  // サブミット
  const onSubmit: FormSubmitHandler<FormData> = (value, dispatch) => {
    dispatch(
      registerSignal.start({
        remoconId: state.remocon!.id,
        code: state.receivedCode || [],
        name: value.name || '',
      })
    );
    dispatch(closeAddDialog());
  };

  const onClickCancelButton = () => {
    dispatch(closeAddDialog());
  };

  return (
    <Dialog
      fullScreen
      open={state.isOpenAddDialog}
      TransitionComponent={Transition}
    >
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            信号の登録
          </Typography>
        </Toolbar>
      </AppBar>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Field
                name="name"
                label="名前"
                component={InputField}
                props={{ fullWidth: true }}
              ></Field>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={onClickCancelButton}>
            キャンセル
          </Button>
          <Button
            variant="contained"
            type="submit"
            color="primary"
            disabled={submitting || invalid}
          >
            作成
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const Transition = React.forwardRef<unknown, TransitionProps>((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default reduxForm({
  validate,
  form: form.sample,
})(AddDialog);
