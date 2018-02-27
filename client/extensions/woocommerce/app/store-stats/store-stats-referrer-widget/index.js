/** @format */

/**
 * External dependencies
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { find, sortBy } from 'lodash';
import { max as d3Max } from 'd3-array';

/**
 * Internal dependencies
 */
import { getSiteStatsNormalizedData } from 'state/stats/lists/selectors';
import Table from 'woocommerce/components/table';
import TableRow from 'woocommerce/components/table/table-row';
import TableItem from 'woocommerce/components/table/table-item';
import HorizontalBar from 'woocommerce/components/d3/horizontal-bar';

class StoreStatsReferrerWidget extends Component {
	static propTypes = {
		data: PropTypes.array.isRequired,
		query: PropTypes.object.isRequired,
		siteId: PropTypes.number,
		statType: PropTypes.string.isRequired,
		selectedDate: PropTypes.string.isRequired,
	};

	render() {
		const { data, selectedDate } = this.props;
		const selectedData = find( data, d => d.date === selectedDate ) || { data: [] };
		const sortedAndTrimmedData = sortBy( selectedData.data, d => -d.sales ).slice( 0, 5 );
		const extent = [ 0, d3Max( sortedAndTrimmedData.map( d => d.sales ) ) ];
		const header = (
			<TableRow isHeader>
				<TableItem isHeader isTitle>
					Source
				</TableItem>
				<TableItem isHeader>Gross Sales</TableItem>
			</TableRow>
		);
		return (
			<Table className="store-stats-referrer-widget" header={ header } compact>
				{ sortedAndTrimmedData.map( d => {
					return (
						<TableRow key={ d.referrer }>
							<TableItem isTitle>{ d.referrer }</TableItem>
							<TableItem>
								<HorizontalBar
									extent={ extent }
									data={ d.sales }
									currency={ d.currency }
									height={ 20 }
								/>
							</TableItem>
						</TableRow>
					);
				} ) }
			</Table>
		);
	}
}

export default connect( ( state, { siteId, statType, query } ) => {
	return {
		data: getSiteStatsNormalizedData( state, siteId, statType, query ),
	};
} )( StoreStatsReferrerWidget );
