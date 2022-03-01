import csstree from 'css-tree';
import { validate } from 'csstree-validator';

const validator = (code) => {
	return validate(code);
};

export const parseCssToAst = (code) => {
	const ast = csstree.parse(code, { positions: true, parseValue: false });
	return ast;
};

const compareProperty = (node, compareAst) => {
	const nodeSelector = csstree
		.generate(node.prelude)
		.replaceAll('"', '')
		.replaceAll("'", '');
	const propertyList = [];

	csstree.walk(node, (aNode) => {
		if (aNode.type === 'Declaration') {
			propertyList.push(aNode);
		}
	});

	let existSameRule = false;
	const sameRuleDiffPropertysList = propertyList.filter((propertyItem) => {
		return !csstree.find(compareAst, (cNode) => {
			let result = false;
			if (cNode.type === 'Rule') {
				const cSelector = csstree.generate(cNode.prelude).replaceAll('"', '').replaceAll("'", '');
				// same rule
				if (
					cSelector === nodeSelector ||
					cSelector?.includes(nodeSelector + ',') ||
					cSelector?.split(',').every((str) => nodeSelector.includes(str))
				) {
					existSameRule = true
					result = !!csstree.find(cNode, (dNode) => {
						if (dNode.type === 'Declaration') {
							if (
								dNode.property === propertyItem.property &&
								dNode.value.value === propertyItem.value.value
							) {
								return true;
							} else {
								return false;
							}
						}
					});
				}
			}
			return result;
		});
	});
	return existSameRule ? sameRuleDiffPropertysList : [node];
};

const getDiffNodesList = ({ ast1, ast2 }) => {
	let diffNodesList = [];
	csstree.walk(ast2,  (node, item, list) =>{
		if (node.type === 'Rule') {
			const diffNodes = compareProperty(node, ast1);
			if (diffNodes.length > 0) {
				diffNodesList.push(diffNodes);
			}
		}
	});
	return diffNodesList.flat();
};

export const getDiffPropertyOfCss = ({ css1, css2 }) => {
	return new Promise(async (resolve, reject) => {
		try {
			const css1Valid = validator(css1);
			const css2Valid = validator(css2);

			if (css1Valid[0] || css2Valid[0]) {
				reject([
					css1Valid,
					css2Valid,
				]);
			} else {
				const ast1 = parseCssToAst(css1);
				const ast2 = parseCssToAst(css2);
				const diff = getDiffNodesList({ ast1, ast2 });
				resolve(diff);
			}
		} catch (e) {
			console.error(e);
		}
	});
};
