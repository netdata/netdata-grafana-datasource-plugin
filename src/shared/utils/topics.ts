const CHART_DATA = 'CHART_DATA';

/**
 * PubSub treats "." as a hierarchy separator, so a refId containing one would leak a query's
 * response to the editor of a shorter refId. Reduce refIds to a single safe segment.
 */
export const chartDataTopic = (refId?: string) => `${CHART_DATA}.${(refId || 'unknown').replace(/\W/g, '_')}`;
