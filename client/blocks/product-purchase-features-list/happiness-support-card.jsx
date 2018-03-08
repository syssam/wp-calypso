/** @format */

/**
 * External dependencies
 */

import React from 'react';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import HappinessSupport from 'components/happiness-support';
import PurchaseDetail from 'components/purchase-detail';

export default localize( ( { isJetpack, isJetpackFreePlan, showLiveChatButton, translate } ) => (
	<div className="product-purchase-features-list__item ">
		<PurchaseDetail
			icon={ <img alt="" src="/calypso/images/illustrations/happiness-support.svg" /> }
			title={
				isJetpackFreePlan ? translate( 'Support documentation' ) : translate( 'Priority support' )
			}
			description={
				isJetpackFreePlan
					? translate(
							'{{strong}}Need help?{{/strong}} ' +
								'Search our support site to find out more about how to make the most of your Jetpack site.'
						)
					: translate(
							'{{strong}}Need help?{{/strong}} ' +
								'A Happiness Engineer can answer questions about your site, your account, or how to do just about anything.'
						)
			}
		/>
	</div>
) );
