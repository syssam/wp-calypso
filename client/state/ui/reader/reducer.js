/** @format */

/**
 * Internal dependencies
 */

import sidebar from './sidebar/reducer';
import { combineReducers } from 'state/utils';
import cardExpansions from './card-expansions/reducer';
import { READER_VIEW_STREAM } from 'state/action-types';

/**
 * Holds the viewed touched stream for the purposes of keyboard navigation
 *
 * @param {*} state
 * @param {*} action
 */
export const currentStream = ( state = null, action ) =>
	action.type === READER_VIEW_STREAM ? action.payload.streamKey : state;

export default combineReducers( {
	sidebar,
	cardExpansions,
	currentStream,
} );
