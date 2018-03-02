/** @format */
/**
 * External dependencies
 */
import { findIndex } from 'lodash';

/**
 * Internal dependencies
 */
import { keysAreEqual, keyToString } from './post-key';

const emptyStream = { items: [], pendingItems: [], lastPage: false, isRequesting: false };
/**
 * @param {*} streamKey key of the stream to get
 * @returns {Object} Stream of type { items: Array<PostKey>, pendingItems: Array<PostKey> }
 */

export function getStream( state, streamKey ) {
	return state.reader.streams[ streamKey ] || emptyStream;
}

export function getCurrentStream( state ) {
	return state.ui.reader.currentStream;
}

function getOffsetItem( state, currentItem, offset ) {
	const streamKey = getCurrentStream( state );
	if ( ! streamKey ) {
		return null;
	}

	const stream = state.reader.streams[ streamKey ];
	const index = findIndex( stream.items, item => keysAreEqual( item, currentItem ) );
	const newIndex = index + offset;

	if ( newIndex >= 0 && newIndex < stream.items.length ) {
		return stream.items[ newIndex ];
	}

	return null;
}

export const getNextItem = ( state, currentItem ) => getOffsetItem( state, currentItem, 1 );
export const getPreviousItem = ( state, currentItem ) => getOffsetItem( state, currentItem, -1 );
