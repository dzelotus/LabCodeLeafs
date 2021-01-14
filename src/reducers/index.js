import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';

import EditProfileReducer from './EditProfileReducer';

export default combineReducers({
	auth: AuthReducer,
	profile: EditProfileReducer,
});
