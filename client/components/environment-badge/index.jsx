/**
 * External dependencies
 *
 * @format
 */

import React from 'react';

/**
 * Internal dependencies
 */

function EnvironmentBadge( {
	abTestHelper,
	branchName,
	commitChecksum,
	devDocs,
	devDocsURL,
	badge,
	feedbackURL,
	preferencesHelper,
} ) {
	return (
		<div className="environment-badge">
			{ /* eslint-disable wpcalypso/jsx-classname-namespace */ }
			{ preferencesHelper && <div className="environment is-prefs" /> }
			{ abTestHelper && <div className="environment is-tests" /> }
			{ branchName &&
				branchName !== 'master' && (
					<span className="environment branch-name" title={ 'Commit ' + commitChecksum }>
						{ branchName }
					</span>
				) }
			{ devDocs && (
				<span className="environment is-docs">
					<a href={ devDocsURL } title="DevDocs">
						docs
					</a>
				</span>
			) }
			<span className={ `environment is-${ badge } is-env` }>{ badge }</span>
			<a className="bug-report" href={ feedbackURL } title="Report an issue" target="_blank" />
			{ /* eslint-enable wpcalypso/jsx-classname-namespace */ }
		</div>
	);
}

export default EnvironmentBadge;
