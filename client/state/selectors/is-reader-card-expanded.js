/** @format */

/**
 * Internal dependencies
 */

import { keyToString } from 'state/reader/streams/post-key';

export default function isReaderCardExpanded( state, postKey ) {
	const key = keyToString( postKey );
	return !! ( key && state.ui.reader.cardExpansions[ key ] );
}
