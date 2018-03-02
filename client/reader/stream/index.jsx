/** @format */
/**
 * External dependencies
 */
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import { defer, findLast, noop, times, clamp, identity, map } from 'lodash';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import ReaderMain from 'components/reader-main';
import EmptyContent from './empty';
import {
	requestPage,
	selectFirstItem,
	selectItem,
	selectNextItem,
	selectPrevItem,
	showUpdates,
	// shufflePosts,
} from 'state/reader/streams/actions';
import { getStream } from 'state/reader/streams/selectors';
import LikeStore from 'lib/like-store/like-store';
import { likePost, unlikePost } from 'lib/like-store/actions';
import LikeHelper from 'reader/like-helper';
import ListEnd from 'components/list-end';
import InfiniteList from 'components/infinite-list';
import MobileBackToSidebar from 'components/mobile-back-to-sidebar';
import PostPlaceholder from './post-placeholder';
import UpdateNotice from 'reader/update-notice';
import KeyboardShortcuts from 'lib/keyboard-shortcuts';
import scrollTo from 'lib/scroll-to';
import XPostHelper from 'reader/xpost-helper';
import PostLifecycle from './post-lifecycle';
import { showSelectedPost } from 'reader/utils';
import getBlockedSites from 'state/selectors/get-blocked-sites';
import { getReaderFollows } from 'state/selectors';
import { keysAreEqual, keyToString, keyForPost } from 'lib/feed-stream-store/post-key';
import { resetCardExpansions } from 'state/ui/reader/card-expansions/actions';
import { combineCards, injectRecommendations, RECS_PER_BLOCK } from './utils';
import { reduxGetState } from 'lib/redux-bridge';
import { getPostByKey } from 'state/reader/posts/selectors';
import { viewStream } from 'state/reader/watermarks/actions';

const GUESSED_POST_HEIGHT = 600;
const HEADER_OFFSET_TOP = 46;

const MIN_DISTANCE_BETWEEN_RECS = 4; // page size is 7, so one in the middle of every page and one on page boundries, sometimes
const MAX_DISTANCE_BETWEEN_RECS = 30;

function getDistanceBetweenRecs( totalSubs ) {
	// the distance between recs changes based on how many subscriptions the user has.
	// We cap it at MAX_DISTANCE_BETWEEN_RECS.
	// It grows at the natural log of the number of subs, times a multiplier, offset by a constant.
	// This lets the distance between recs grow quickly as you add subs early on, and slow down as you
	// become a common user of the reader.
	if ( totalSubs <= 0 ) {
		// 0 means either we don't know yet, or the user actually has zero subs.
		// if a user has zero subs, we don't show posts at all, so just treat 0 as 'unknown' and
		// push recs to the max.
		return MAX_DISTANCE_BETWEEN_RECS;
	}
	const distance = clamp(
		Math.floor( Math.log( totalSubs ) * Math.LOG2E * 5 - 6 ),
		MIN_DISTANCE_BETWEEN_RECS,
		MAX_DISTANCE_BETWEEN_RECS
	);
	return distance;
}

class ReaderStream extends React.Component {
	static propTypes = {
		recommendationsStore: PropTypes.object,
		trackScrollPage: PropTypes.func.isRequired,
		suppressSiteNameLink: PropTypes.bool,
		showPostHeader: PropTypes.bool,
		showFollowInHeader: PropTypes.bool,
		onUpdatesShown: PropTypes.func,
		emptyContent: PropTypes.object,
		className: PropTypes.string,
		showDefaultEmptyContentIfMissing: PropTypes.bool,
		showPrimaryFollowButtonOnCards: PropTypes.bool,
		showMobileBackToSidebar: PropTypes.bool,
		placeholderFactory: PropTypes.func,
		followSource: PropTypes.string,
		isDiscoverStream: PropTypes.bool,
		shouldCombineCards: PropTypes.bool,
		useCompactCards: PropTypes.bool,
		transformStreamItems: PropTypes.func,
		isMain: PropTypes.bool,
		intro: PropTypes.object,
		forcePlaceholders: PropTypes.bool,
	};

	static defaultProps = {
		showPostHeader: true,
		suppressSiteNameLink: false,
		showFollowInHeader: false,
		onUpdatesShown: noop,
		className: '',
		showDefaultEmptyContentIfMissing: true,
		showPrimaryFollowButtonOnCards: true,
		showMobileBackToSidebar: true,
		isDiscoverStream: false,
		shouldCombineCards: true,
		transformStreamItems: identity,
		isMain: true,
		useCompactCards: false,
		intro: null,
		forcePlaceholders: false,
	};

	getStateFromStores() {
		// const posts = map( store.get(), props.transformStreamItems );
		// const recs = recommendationsStore ? recommendationsStore.get() : null;
		// // do we have enough recs? if we have a store, but not enough recs, we should fetch some more...
		// if ( recommendationsStore ) {
		// 	if (
		// 		! recs ||
		// 		recs.length < posts.length * ( RECS_PER_BLOCK / getDistanceBetweenRecs( totalSubs ) )
		// 	) {
		// 		if ( ! recommendationsStore.isFetchingNextPage() ) {
		// 			defer( () => fetchNextPage( recommendationsStore.id ) );
		// 		}
		// 	}
		// }
		// let items = this.state && this.state.items;
		// if ( ! this.state || posts !== this.state.posts || recs !== this.state.recs ) {
		// 	items = injectRecommendations( posts, recs, getDistanceBetweenRecs( totalSubs ) );
		// }
		// if ( props.shouldCombineCards ) {
		// 	items = combineCards( items );
		// }
	}

	componentDidUpdate( { selectedPostKey } ) {
		if ( ! keysAreEqual( selectedPostKey, this.props.selectedPostKey ) ) {
			this.scrollToSelectedPost( true );
		}
	}

	_popstate = () => {
		if ( this.props.selectedPostKey && history.scrollRestoration !== 'manual' ) {
			this.scrollToSelectedPost( false );
		}
	};

	scrollToSelectedPost( animate ) {
		const HEADER_OFFSET = -80; // a fixed position header means we can't just scroll the element into view.
		const selectedNode = ReactDom.findDOMNode( this ).querySelector( '.is-selected' );
		if ( selectedNode ) {
			const documentElement = document.documentElement;
			selectedNode.focus();
			const windowTop =
				( window.pageYOffset || documentElement.scrollTop ) - ( documentElement.clientTop || 0 );
			const boundingClientRect = selectedNode.getBoundingClientRect();
			const scrollY = parseInt( windowTop + boundingClientRect.top + HEADER_OFFSET, 10 );
			if ( animate ) {
				scrollTo( {
					x: 0,
					y: scrollY,
					duration: 200,
				} );
			} else {
				window.scrollTo( 0, scrollY );
			}
		}
	}

	componentDidMount() {
		const { streamKey } = this.props;
		this.props.recommendationsStore &&
			this.props.recommendationsStore.on( 'change', this.updateState );
		this.props.resetCardExpansions();
		this.props.viewStream( { streamKey } );

		KeyboardShortcuts.on( 'move-selection-down', this.selectNextItem );
		KeyboardShortcuts.on( 'move-selection-up', this.selectPrevItem );
		KeyboardShortcuts.on( 'open-selection', this.handleOpenSelection );
		KeyboardShortcuts.on( 'like-selection', this.toggleLikeOnSelectedPost );
		KeyboardShortcuts.on( 'go-to-top', this.goToTop );
		window.addEventListener( 'popstate', this._popstate );
		if ( 'scrollRestoration' in history ) {
			history.scrollRestoration = 'manual';
		}
	}

	componentWillUnmount() {
		this.props.recommendationsStore &&
			this.props.recommendationsStore.off( 'change', this.updateState );

		KeyboardShortcuts.off( 'move-selection-down', this.selectNextItem );
		KeyboardShortcuts.off( 'move-selection-up', this.selectPrevItem );
		KeyboardShortcuts.off( 'open-selection', this.handleOpenSelection );
		KeyboardShortcuts.off( 'like-selection', this.toggleLikeOnSelectedPost );
		KeyboardShortcuts.off( 'go-to-top', this.goToTop );
		window.removeEventListener( 'popstate', this._popstate );
		if ( 'scrollRestoration' in history ) {
			history.scrollRestoration = 'auto';
		}
	}

	componentWillReceiveProps( nextProps ) {
		const { streamKey } = nextProps;
		if ( streamKey !== this.props.streamKey ) {
			this.props.resetCardExpansions();
			this.props.viewStream( { streamKey } );
		}
	}

	handleOpenSelection = () => {
		showSelectedPost( {
			store: this.props.streamKey,
			postKey: this.props.selectedPostKey,
		} );
	};

	toggleLikeOnSelectedPost = () => {
		const { selectedPostKey: postKey } = this.props;
		let post;

		if ( postKey && ! postKey.isGap ) {
			post = getPostByKey( reduxGetState(), postKey );
		}

		// only toggle a like on a x-post if we have the appropriate metadata,
		// and original post is full screen
		const xPostMetadata = XPostHelper.getXPostMetadata( post );
		if ( !! xPostMetadata.postURL ) {
			return;
		}

		if ( LikeHelper.shouldShowLikes( post ) ) {
			this.toggleLikeAction( post.site_ID, post.ID );
		}
	};

	toggleLikeAction( siteId, postId ) {
		const liked = LikeStore.isPostLikedByCurrentUser( siteId, postId );
		if ( liked === null ) {
			// unknown... ignore for now
			return;
		}

		const toggler = liked ? unlikePost : likePost;
		toggler( siteId, postId );
	}

	goToTop = () => {
		const { streamKey, updateCount } = this.props;
		if ( updateCount > 0 ) {
			this.props.showUpdates( { streamKey } );
		} else {
			this.props.selectFirstItem( { streamKey } );
		}
	};

	getVisibleItemIndexes() {
		return this._list && this._list.getVisibleItemIndexes( { offsetTop: HEADER_OFFSET_TOP } );
	}

	selectNextItem = () => {
		const { streamKey, items, posts } = this.props;
		// do we have a selected item? if so, just move to the next one
		if ( this.props.selectedPostKey ) {
			this.props.selectNextItem( { streamKey, items } );
			return;
		}

		const visibleIndexes = this.getVisibleItemIndexes();

		// This is slightly magical...
		// When a user tries to select the "next" item, we really want to select
		// the next item if and only if the currently selected item is at the top of the
		// screen. If the currently selected item is off screen, we'd rather select the item
		// at the top of the screen, rather than the strictly "next" item. This is so a user can
		// pick an item with the keyboard shortcuts, then scroll down a bit, then hit `next` again
		// and have it pick the item at the top of the screen, rather than the item we scrolled past
		if ( visibleIndexes && visibleIndexes.length > 0 ) {
			// default to the first item in the visible list. this item is likely off screen when the user
			// is scrolled down the page
			let index = visibleIndexes[ 0 ].index;

			// walk down the list of "visible" items, looking for the first item whose top extent is on screen
			for ( let i = 0; i < visibleIndexes.length; i++ ) {
				const visibleIndex = visibleIndexes[ i ];
				// skip items whose top are off screen or are recommendation blocks
				if ( visibleIndex.bounds.top > 0 && ! items[ visibleIndex.index ].isRecommendationBlock ) {
					index = visibleIndex.index;
					break;
				}
			}

			const candidateItem = items[ index ];
			// is this a combo card?
			if ( candidateItem.isCombination ) {
				// pick the first item
				const postKey = { postId: candidateItem.postIds[ 0 ] };
				if ( candidateItem.feedId ) {
					postKey.feedId = candidateItem.feedId;
				} else {
					postKey.blogId = candidateItem.blogId;
				}
				this.props.selectItem( { streamKey, postKey } );
			}

			// find the index of the post / gap in the posts array.
			// Start the search from the index in the items array, which has to be equal to or larger than
			// the index in the posts array.
			// Use lastIndexOf to walk the array from right to left
			const selectedPostKey = findLast( posts, items[ index ], index );
			if ( keysAreEqual( selectedPostKey, this.props.selectedPostKey ) ) {
				this.props.selectNextItem( { streamKey, items } );
			} else {
				this.props.selectItem( { streamKey, postKey: selectedPostKey } );
			}
		}
	};

	selectPrevItem = () => {
		const { streamKey, selectedPostKey, items } = this.props;
		// unlike selectNextItem, we don't want any magic here. Just move back an item if the user
		// currently has a selected item. Otherwise do nothing.
		// We avoid the magic here because we expect users to enter the flow using next, not previous.
		if ( selectedPostKey ) {
			this.props.selectPrevItem( { streamKey, items } );
		}
	};

	fetchNextPage = options => {
		if ( options.triggeredByScroll ) {
			// this.props.trackScrollPage( this.props.postsStore.getPage() + 1 );
		}
		this.props.requestPage( {
			streamKey: this.props.streamKey,
			pageHandle: this.props.stream.pageHandle,
		} );
	};

	showUpdates = () => {
		const { streamKey } = this.props;
		this.props.onUpdatesShown();
		this.props.showUpdates( { streamKey } );
		// if ( this.props.recommendationsStore ) {
		// 	shufflePosts( this.props.recommendationsStore.id );
		// }
		// if ( this._list ) {
		// 	this._list.scrollToTop();
		// }
	};

	renderLoadingPlaceholders = () => {
		const { posts } = this.props;
		const count = posts.length ? 2 : 4; // @TODO: figure out what numbers should go here and make sensible const

		return times( count, i => {
			if ( this.props.placeholderFactory ) {
				return this.props.placeholderFactory( { key: 'feed-post-placeholder-' + i } );
			}
			return <PostPlaceholder key={ 'feed-post-placeholder-' + i } />;
		} );
	};

	getPostRef = postKey => {
		return keyToString( postKey );
	};

	renderPost = ( postKey, index ) => {
		const { selectedPostKey, streamKey } = this.props;
		// const recStoreId = this.props.recommendationsStore && this.props.recommendationsStore.id;
		const isSelected = !! (
			selectedPostKey &&
			selectedPostKey.postId === postKey.postId &&
			( selectedPostKey.blogId === postKey.blogId || selectedPostKey.feedId === postKey.feedId )
		);

		const itemKey = this.getPostRef( postKey );
		const showPost = args =>
			showSelectedPost( {
				...args,
				postKey: postKey.isCombination ? keyForPost( args ) : postKey,
				streamKey,
			} );

		return (
			<PostLifecycle
				key={ itemKey }
				ref={ itemKey }
				isSelected={ isSelected }
				handleClick={ showPost }
				postKey={ postKey }
				suppressSiteNameLink={ this.props.suppressSiteNameLink }
				showPostHeader={ this.props.showPostHeader }
				showFollowInHeader={ this.props.showFollowInHeader }
				showPrimaryFollowButtonOnCards={ this.props.showPrimaryFollowButtonOnCards }
				isDiscoverStream={ this.props.isDiscoverStream }
				showSiteName={ this.props.showSiteNameOnCards }
				followSource={ this.props.followSource }
				blockedSites={ this.props.blockedSites }
				index={ index }
				selectedPostKey={ selectedPostKey }
				// recStoreId={ recStoreId }
				compact={ this.props.useCompactCards }
			/>
		);
	};

	render() {
		const { forcePlaceholders, posts, pendingItems, updateCount, lastPage } = this.props;
		let { items, isRequesting } = this.props;

		const hasNoPosts = false && posts.length === 0;
		let body, showingStream;

		// trick an infinite list to showing placeholders
		if ( forcePlaceholders ) {
			items = [];
			isRequesting = true;
		}

		// @TODO: has error of invalid tag?
		if ( hasNoPosts ) {
			body = this.props.emptyContent;
			if ( ! body && this.props.showDefaultEmptyContentIfMissing ) {
				body = <EmptyContent />;
			}
			showingStream = false;
		} else {
			body = (
				<InfiniteList
					ref={ c => ( this._list = c ) }
					className="reader__content"
					items={ items }
					lastPage={ lastPage }
					fetchingNextPage={ isRequesting }
					guessedItemHeight={ GUESSED_POST_HEIGHT }
					fetchNextPage={ this.fetchNextPage }
					getItemRef={ this.getPostRef }
					renderItem={ this.renderPost }
					renderLoadingPlaceholders={ this.renderLoadingPlaceholders }
				/>
			);
			showingStream = true;
		}
		const TopLevel = this.props.isMain ? ReaderMain : 'div';
		return (
			<TopLevel className={ classnames( 'following', this.props.className ) }>
				{ this.props.isMain &&
					this.props.showMobileBackToSidebar && (
						<MobileBackToSidebar>
							<h1>{ this.props.translate( 'Streams' ) }</h1>
						</MobileBackToSidebar>
					) }

				<UpdateNotice
					count={ updateCount }
					onClick={ this.props.showUpdates }
					pendingPostKeys={ pendingItems }
				/>
				{ this.props.children }
				{ showingStream && posts.length ? this.props.intro : null }
				{ body }
				{ showingStream && false /*TODO: make work */ && posts.length && <ListEnd /> }
			</TopLevel>
		);
	}
}

export default localize(
	connect(
		( state, { streamKey } ) => ( {
			blockedSites: getBlockedSites( state ),
			totalSubs: getReaderFollows( state ).length,
			stream: getStream( state, streamKey ),
			items: getStream( state, streamKey ).items,
			posts: getStream( state, streamKey ).items,
			pendingItems: getStream( state, streamKey ).pendingItems,
			updateCount: getStream( state, streamKey ).pendingItems.length,
			selectedPostKey: getStream( state, streamKey ).selected,
			lastPage: getStream( state, streamKey ).lastPage,
			isRequesting: getStream( state, streamKey ).isRequesting,
		} ),
		{
			resetCardExpansions,
			requestPage,
			selectItem,
			selectNextItem,
			selectPrevItem,
			showUpdates,
			viewStream,
			// shufflePosts,
		}
	)( ReaderStream )
);
