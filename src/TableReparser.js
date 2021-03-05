// import { JSDOM } from 'jsdom';

const rules = {
	'<table>': '<div style="margin: 10px;">',
	'<th>': '<div style="font-weight: bold;">',
	'</th>': '</div>',
	'<tr>': '<div style="margin-top: 5px">',
	'<td>': '<div style="margin: 0 2px;">',
	'</td>': '</div>',
	'</tr>': '</div>',
	'</table>': '</div>',
};
// const jsdom = require('jsdom');

// const { JSDOM } = jsdom;

const tableReparse = (article) => {
	while (article.search('<table|<tr|<td|<th') !== -1) {
		// eslint-disable-next-line guard-for-in,no-restricted-syntax
		for (const rule in rules) {
			article = article.replace(rule, rules[rule]);
		}
	}

	return article;
};

export default tableReparse;
// export const articleReparse = (article) => {
// 	if (article === undefined) {
// 		return;
// 	}
// 	const htmlDoc = JSDOM.fragment(article);
// 	const tables = htmlDoc.querySelector('table');
// 	for (let i = 0; i < tables.length; i += 1) {
// 		tables[i].replaceWith(parseTable(tables[i]));
// 	}
//
// 	return htmlDoc.body.innerHTML;
// };
//
// const parseTable = (tableNode) => {
// 	const rowNodes = tableNode.querySelector('tr');
// 	const rowsData = [];
// 	for (let i = 0; i < rowNodes.length; i += 1) {
// 		rowsData.push(parseRow(rowNodes[i]));
// 	}
//
// 	const columns = arrRows2arrCols(rowsData);
// 	const styles = getTableStyles(tableNode);
// 	const tableData = [];
// 	// eslint-disable-next-line prefer-const
// 	for (let { span, styleSpan } of styles) {
// 		for (; span > 0; span -= 1) {
// 			tableData.push(
// 				`<div display="flex" flex-direction="column" style="${styleSpan}"> ${columns
// 					.pop()
// 					.join(' ')} </div>`,
// 			);
// 		}
// 	}
//
// 	while (columns.length > 0) {
// 		tableData.push(
// 			`<div display="flex" flex-direction="column"> ${columns.pop().join(' ')} </div>`,
// 		);
// 	}
//
// 	return tableData;
// };
//
// const parseRow = (rowNode) => {
// 	const cellNodes = rowNode.children;
// 	const cellsData = [];
// 	for (let i = 0; i < cellNodes; i += 1) {
// 		cellsData.push(`<div>${cellNodes[i].innerHTML}</div>`);
// 	}
//
// 	return cellsData;
// };
//
// const arrRows2arrCols = (arr) => {
// 	const result = [];
// 	// only for quadratic matrix
// 	for (let i = 0; i < arr.length; i += 1) {
// 		result.push([]);
// 	}
//
// 	for (let i = 0; i < arr.length; i += 1) {
// 		for (let j = 0; j < arr[i].length; j += 1) {
// 			result[j].push(arr[i][j]);
// 		}
// 	}
//
// 	return result;
// };
//
// const getTableStyles = (tableNode) => {
// 	const styles = { spans: [], spanStyles: [] };
// 	for (const colgroup of tableNode.querySelector('colgroup')) {
// 		for (const col of colgroup.children()) {
// 			const span = col.getAttribute('span');
// 			const styles = col.getAttribute('style');
// 			styles.spans.push(span === undefined ? 1 : span);
// 			styles.spanStyles.push(styles);
// 		}
// 	}
//
// 	return styles;
// };
