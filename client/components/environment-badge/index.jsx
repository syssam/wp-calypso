/**
 * External dependencies
 *
 * @format
 */

import React from 'react';

/**
 * Internal dependencies
 */

export function PreferencesHelper() {
	/* eslint-disable wpcalypso/jsx-classname-namespace */
	return <div className="environment is-prefs" />;
	/* eslint-enable wpcalypso/jsx-classname-namespace */
}

export function TestHelper() {
	/* eslint-disable wpcalypso/jsx-classname-namespace */
	return <div className="environment is-tests" />;
	/* eslint-enable wpcalypso/jsx-classname-namespace */
}

export function Branch( { branchName, commitChecksum } ) {
	return branchName === 'master' ? null : (
		/* eslint-disable wpcalypso/jsx-classname-namespace */
		<span className="environment branch-name" title={ 'Commit ' + commitChecksum }>
			{ branchName }
		</span>
		/* eslint-enable wpcalypso/jsx-classname-namespace */
	);
}

export function DevDocsLink( { url } ) {
	return (
		/* eslint-disable wpcalypso/jsx-classname-namespace */
		<span className="environment is-docs">
			<a href={ url } title="DevDocs">
				docs
			</a>
		</span>
		/* eslint-enable wpcalypso/jsx-classname-namespace */
	);
}

function EnvironmentBadge( { badge, feedbackURL, children } ) {
	return (
		<div className="environment-badge">
			{ /* eslint-disable wpcalypso/jsx-classname-namespace */ }
			{ children }
			<span className={ `environment is-${ badge } is-env` }>{ badge }</span>
			<a className="bug-report" href={ feedbackURL } title="Report an issue" target="_blank" />
			{ /* eslint-enable wpcalypso/jsx-classname-namespace */ }
		</div>
	);
}

export default EnvironmentBadge;
