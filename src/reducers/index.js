import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import CatalogReducer from './CatalogReducer';
import EditProfileReducer from './EditProfileReducer';
import GardenReducer from './GardenReducer';

export default combineReducers({
	auth: AuthReducer,
	catalog: CatalogReducer,
	profile: EditProfileReducer,
	garden: GardenReducer,
});
