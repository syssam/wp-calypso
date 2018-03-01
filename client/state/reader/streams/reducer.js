/** @format */

/**
 * External dependencies
 */
import { uniqBy } from 'lodash';

/**
 * Internal dependencies
 */
import { keyedReducer, combineReducers } from 'state/utils';
import {
	READER_STREAMS_PAGE_RECEIVE,
	READER_STREAMS_SELECT_ITEM,
	READER_STREAMS_UPDATES_RECEIVE,
} from 'state/action-types';
import { keyToString } from './post-key';

export const items = ( state = [], action ) => {
	switch ( action.type ) {
		case READER_STREAMS_PAGE_RECEIVE:
			const { posts } = action.payload;
			const postKeys = posts.map( keyMaker );

			const newState = uniqBy( [ ...state, postKeys ], keyToString );
			// if we actually modified the state, then return that
			if ( newState.length > state.length ) {
				return newState;
			}
			return state;
	}
	return state;
};

export const pendingItems = ( state = [], action ) => {
	switch ( action.type ) {
		case READER_STREAMS_UPDATES_RECEIVE:
			const { postKeys } = action.payload;
			return uniqBy( [ ...postKeys, ...state ], keyToString );
	}
	return state;
};

export const selected = ( state = null, action ) => {
	switch ( action.type ) {
		case READER_STREAMS_SELECT_ITEM: // probably wants to actually open post instead of select?
			return action.payload.index;
	}
	return state;
};

/**
 * @param {boolean} state - prev state
 * @param {Object} action - incoming action
 * @return {boolean} if a stream is on its last page
 */
export const lastPage = ( state = false, action ) => {
	if ( action.type === READER_STREAMS_PAGE_RECEIVE ) {
		return action.payload.posts.length > 0;
	}
	return state;
};

const streamReducer = combineReducers( {
	items,
	pendingItems,
	selected,
	lastPage,
} );

/**
 * Holds the last touched stream for the purposes of keyboard navigation
 *
 * @param {*} state
 * @param {*} action
 */
export const currentStream = ( state = null, action ) => {
	switch ( action.type ) {
		case READER_STREAMS_SELECT_ITEM:
			return action.payload.streamKey;
	}
	return state;
};

export default combineReducers( {
	byKey: keyedReducer( 'payload.streamKey', streamReducer ),
	currentStream,
} );
