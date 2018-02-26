/** @format */
/**
 * Internal Dependencies
 */

import {
	READER_STREAMS_PAGE_REQUEST,
	READER_STREAMS_PAGE_RECEIVE,
	READER_STREAMS_SHOW_UPDATES,
	READER_STREAMS_SELECT_ITEM,
	READER_STREAMS_SELECT_NEXT_ITEM,
	READER_STREAMS_SELECT_PREV_ITEM,
	READER_STREAMS_FILL_GAP,
	READER_STREAMS_DISMISS_POST,
	READER_STREAMS_UPDATES_RECEIVE,
} from 'state/action-types';

/**
 * Fetch posts into a stream
 *
 * This action will fetch a range of posts for a stream and then dispatch
 * READER_STREAM_PAGE_RECEIVE when the page returns. This is usually used to
 * fetch the next page of results, but could be used to fetch arbitrary ranges.
 * @param  {string} streamKey The stream to fetch posts for
 * @param  {object} query    The query for posts. Parameters vary by stream type.
 * @return {object}          The action object
 */
export function requestPage( { streamKey, query } ) {
	const indexOfColon = streamKey.indexOf( ':' );
	const streamType = indexOfColon === -1 ? streamKey : streamKey.substring( 0, indexOfColon );
	return {
		type: READER_STREAMS_PAGE_REQUEST,
		payload: {
			streamKey,
			query,
			streamType,
		},
	};
}

export function receivePage( { streamKey, query, posts } ) {
	return {
		type: READER_STREAMS_PAGE_RECEIVE,
		payload: {
			streamKey,
			query,
			posts,
		},
	};
}

export function showUpdates( { streamKey } ) {
	return {
		type: READER_STREAMS_SHOW_UPDATES,
		payload: { streamKey },
	};
}

export function receiveUpdates( { streamKey, posts } ) {
	return {
		type: READER_STREAMS_UPDATES_RECEIVE,
		payload: { streamKey, posts },
	};
}

export function selectItem( { streamKey } ) {
	return {
		type: READER_STREAMS_SELECT_ITEM,
		payload: { streamKey },
	};
}

export function selectNextItem( { streamKey } ) {
	return {
		type: READER_STREAMS_SELECT_NEXT_ITEM,
		payload: { streamKey },
	};
}

export function selectPrevItem( { streamKey } ) {
	return {
		type: READER_STREAMS_SELECT_PREV_ITEM,
		payload: { streamKey },
	};
}

export function fillGap( { streamKey, gap } ) {
	return {
		type: READER_STREAMS_FILL_GAP,
		payload: { streamKey, gap },
	};
}

export function dismissPost( { streamKey, postId } ) {
	return {
		type: READER_STREAMS_DISMISS_POST,
		payload: { streamKey, postId },
	};
}
