import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ComponentProps, useState } from 'react';

type DatePickerFieldProps = ComponentProps<typeof DatePicker>;

function DatePickerField(props: DatePickerFieldProps) {
  const { slotProps, onOpen, onClose, ...rest } = props;
  const [open, setOpen] = useState(false);

  return (
    <DatePicker
      {...rest}
      open={open}
      onOpen={() => {
        setOpen(true);
        onOpen?.();
      }}
      onClose={() => {
        setOpen(false);
        onClose?.();
      }}
      slotProps={{
        ...slotProps,
        textField: {
          ...slotProps?.textField,
          onClick: () => setOpen(true),
        },
      }}
    />
  );
}

export default DatePickerField;
