import * as React from 'react';
import { View } from 'react-native';

import { useDispatch } from 'react-redux';
import { setLogout } from '../../redux/Slice/AuthSlice';

import { setReloadChapterList, setReloadPage, setSelectedBabyId } from '../../redux/Slice/AppSlice';

import MMUtils from '../../helpers/Utils';
import MMConstants from '../../helpers/Constants';
import MMSpinner from '../../components/common/Spinner';

export default function Logout() {
	const dispatch = useDispatch();

	React.useEffect(() => {
		async function bootstrapAsync() {
			try {
				MMUtils.removeItemFromStorage(MMConstants.storage.accessToken);
				MMUtils.removeItemFromStorage(MMConstants.storage.userDetail);
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