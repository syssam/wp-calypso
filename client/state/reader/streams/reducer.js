/** @format */

/**
 * External dependencies
 */
import { uniqBy, findIndex } from 'lodash';

/**
 * Internal dependencies
 */
import { keyedReducer, combineReducers } from 'state/utils';
import {
	READER_STREAMS_PAGE_REQUEST,
	READER_STREAMS_PAGE_RECEIVE,
	READER_STREAMS_SELECT_ITEM,
	READER_STREAMS_UPDATES_RECEIVE,
	READER_STREAMS_SELECT_NEXT_ITEM,
	READER_STREAMS_SELECT_PREV_ITEM,
} from 'state/action-types';
import { keyToString, keyForPost, keysAreEqual } from './post-key';

export const items = ( state = [], action ) => {
	switch ( action.type ) {
		case READER_STREAMS_PAGE_RECEIVE:
			const { posts } = action.payload;
			const postKeys = posts.map( keyForPost );

			const newState = uniqBy( [ ...state, ...postKeys ], keyToString );
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
	let idx;
	switch ( action.type ) {
		case READER_STREAMS_SELECT_ITEM:
			return action.payload.postKey;
		case READER_STREAMS_SELECT_NEXT_ITEM:
			idx = findIndex( action.payload.items, item => keysAreEqual( item, state ) );
			return idx === items.length - 1 ? state : action.payload.items[ idx + 1 ];
		case READER_STREAMS_SELECT_PREV_ITEM:
			idx = findIndex( action.payload.items, item => keysAreEqual( item, state ) );
			return idx === 0 ? state : action.payload.items[ idx - 1 ];
	}
	return state;
};

export const isRequesting = ( state = false, action ) => {
	switch ( action.type ) {
		case READER_STREAMS_PAGE_REQUEST:
			return true;
		case READER_STREAMS_PAGE_RECEIVE:
			return false;
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
		return action.payload.posts.length === 0;
	}
	return state;
};

export const pageHandle = ( state = '', action ) => {
	if ( action.type === READER_STREAMS_PAGE_RECEIVE ) {
		return action.payload.pageHandle;
	}
	return state;
};

const streamReducer = combineReducers( {
	items,
	pendingItems,
	selected,
	lastPage,
	isRequesting,
	pageHandle,
} );

export default keyedReducer( 'payload.streamKey', streamReducer );
