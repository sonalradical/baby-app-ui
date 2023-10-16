import * as React from 'react';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const MMDateTimePicker = ({ name, mode, onConfirm, onCancel, minimumDate, maximumDate, ...props }) => {
	return (
		<DateTimePickerModal
			isVisible={true}
			name={name}
			mode={mode}
			onConfirm={onConfirm}
			onCancel={onCancel}
			minimumDate={minimumDate}
			maximumDate={maximumDate}
			minuteInterval={10}
			timeZoneOffsetInMinutes={undefined}
			{...props}
		/>
	)
};

export default MMDateTimePicker;
