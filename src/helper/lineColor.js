const EXTRA_COLOR = 'green';
const DIFF_COLOR = 'yellow';

const getLineColor = (node) => {
	let info = {
		color: '',
		startLine: node.loc.start.line,
		endLine: node.loc.end.line,
	};
	switch (node.type) {
		case 'Rule': {
			info.color = EXTRA_COLOR;
			break;
		}
		case 'Declaration': {
			info.color = DIFF_COLOR;
		}
	}
	return info;
};

export const generateNodesListLineColor = (nodesList) => {
	const nodeColors = nodesList.map((nodes) => {
		return nodes.map((node) => {
			return getLineColor(node);
		});
	});
    return nodeColors.flat();
};
