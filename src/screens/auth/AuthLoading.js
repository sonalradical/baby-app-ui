import jwtDecode from 'jwt-decode';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import MMEnums from '../../helpers/Enums';
import MMUtils from '../../helpers/Utils';
import { setLogin } from '../../redux/Slice/AuthSlice';

export default function AuthLoading({ navigation }) {
	const dispatch = useDispatch();

	const validateToken = async () => {
		const token = await MMUtils.getItemFromStorage(MMEnums.storage.accessToken);
		if (token) {
			const jwtToken = jwtDecode(token.session);

			// unix timestamp in milliseconds
			const now = Date.now();

			if (jwtToken.exp * 1000 > now) {
				const user = await MMUtils.getItemFromStorage(MMEnums.storage.user);
				dispatch(setLogin({ user, token }));
			} else {
				navigation.navigate('Login');
			}
		} else {
			navigation.navigate('Login');
		}
	}

	useEffect(() => {
		validateToken();
	}, []);
};
