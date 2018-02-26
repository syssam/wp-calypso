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
	if ( action.payload.error ) {
	}

	this.oldestPostDate = get( data, [ 'date_range', 'after' ] );
	this.lastPageHandle = get( data, [ 'meta', 'next_page' ], null );

	const posts = data && data.posts;

	if ( ! posts ) {
		this.emitChange();
		return;
	}

	if ( ! posts.length ) {
		this._isLastPage = true;
		this.emitChange();
		return;
	}

	const postKeys = this.filterNewPosts( posts );

	if ( postKeys.length ) {
		const postById = this.postById;
		forEach( postKeys, function( postKey ) {
			postById.add( keyToString( postKey ) );
		} );
		this.postKeys = this.postKeys.concat( postKeys );
	}

	this.page++;
	this.emitChange();
	switch ( action.type ) {
		case READER_STREAMS_PAGE_RECEIVE:
			const { posts } = action.payload;

			// if action doesnt have any posts then exit
			if ( ! posts ) {
				return state;
			}

			// if state didnt exist before now, then the list of postKeys is good enough
			if ( ! state ) {
				return posts;
			}

			return state.concat( posts );
		default:
			return state;
	}
};

export const pendingItems = ( state = [], action ) => {
	switch ( action.type ) {
		case READER_STREAMS_UPDATES_RECEIVE:
			const { postKeys } = action.payload;
			return uniqBy( [ ...postKeys, ...state ], keyToString );
		default:
			return state;
	}
};

export const selected = ( state = null, action ) => {
	switch ( action.type ) {
		case READER_STREAMS_SELECT_ITEM: // probably wants to actually open post instead of select?
			return action.payload.index;
		default:
			return state;
	}
};

const streamReducer = combineReducers( {
	items,
	pendingItems,
	selected,
} );

export default keyedReducer( 'payload.streamKey', streamReducer );
