import * as React from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

class DayPicker extends React.Component {
  render() {
    return (
      <DayPickerInput {...this.props} />
    );
  }
}

export default DayPicker;