/** @format */

/**
 * External dependencies
 */

import React from 'react';
import { translate } from 'i18n-calypso';
import { overEvery as and } from 'lodash';
import Gridicon from 'gridicons';

/**
 * Internal dependencies
 */
import { ButtonRow, makeTour, Step, Tour, Quit } from 'layout/guided-tours/config-elements';
import { hasUserRegisteredBefore } from 'state/ui/guided-tours/contexts';
import { isDesktop } from 'lib/viewport';

class RepositioningStep extends Step {
	componentDidMount() {
		super.componentDidMount();
		this.interval = setInterval( () => {
			this.onScrollOrResize();
		}, 2000 );
	}

	componentWillUnmount() {
		super.componentWillUnmount();
		clearInterval( this.interval );
	}
}

const ADD_MEDIA_BUTTON_LABEL = translate( 'Add Media' );

export const EditorInsertMenuTour = makeTour(
	<Tour
		name="editorInsertMenu"
		path={ [ '/post/', '/page/' ] }
		version="20161215"
		when={ and( hasUserRegisteredBefore( new Date( '2016-12-15' ) ), isDesktop ) }
	>
		<RepositioningStep
			arrow="left-top"
			name="init"
			placement="beside"
			target=".mce-wpcom-insert-menu"
			style={ {
				animationDelay: '10s',
				marginTop: '-8px',
				zIndex: '100000',
			} }
		>
			<p>
				{ translate( '{{addMediaButton/}} has moved to a new button.', {
					components: { addMediaButton: <strong>{ ADD_MEDIA_BUTTON_LABEL }</strong> },
				} ) }
			</p>
			<p>
				{ translate( 'Click {{icon/}} to add media and other kinds of content.', {
					components: { icon: <Gridicon icon="chevron-down" /> },
				} ) }
			</p>
			<ButtonRow>
				<Quit primary>{ translate( 'Got it' ) }</Quit>
			</ButtonRow>
		</RepositioningStep>
	</Tour>
);
