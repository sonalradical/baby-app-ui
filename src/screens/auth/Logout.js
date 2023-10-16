import * as React from 'react';
import { useDispatch } from 'react-redux';

import { setLogout } from '../../redux/Slice/AuthSlice';

import MMUtils from '../../helpers/Utils';
import MMSpinner from '../../components/common/Spinner';
import { View } from 'react-native';

export default function Logout() {
	const dispatch = useDispatch();

	React.useEffect(() => {
		async function bootstrapAsync() {
			try {
				MMUtils.clearStorage();
				dispatch(setLogout());
			} catch (err) {
				MMUtils.consoleError(err);
			}
		}
		bootstrapAsync();
	}, []);

	return (
		<View>
			<MMSpinner size='large' />
		</View>
	);
}