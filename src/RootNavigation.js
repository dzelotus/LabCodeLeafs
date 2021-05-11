/* Компонент React Navigation 5 для доступа к навигации без navigation prop */

import * as React from 'react';

export const navigationRef = React.createRef();

export function navigate(name, params) {
	navigationRef.current?.navigate(name, params);
}
