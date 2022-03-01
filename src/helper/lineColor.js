const EXTRA_COLOR = 'green';
const DIFF_COLOR = 'yellow';
const ERROR_COLOR = 'red';

const getLineColor = (node, startLine, endLine) => {
	let info = {
		color: '',
		startLine: startLine || node.loc.start.line,
		endLine: endLine || node.loc.end.line,
	};
	switch (node.type) {
		case 'Rule': {
			info.color = EXTRA_COLOR;
			break;
		}
		case 'Declaration': {
			info.color = DIFF_COLOR;
			break;
		}
		case 'Error': {
			info.color = ERROR_COLOR;
			break;
		}
	}
	return info;
};

export const generateNodesListLineColor = (nodesList) => {
	const nodeColors = nodesList.map((node) => {
		return getLineColor(node);
	});
	return nodeColors.flat();
};

export const getSyntaxErrorColors = (errorList) => {
	return errorList.map((e) => {
		return getLineColor(
			{
				type: 'Error',
			},
			e.line,
			e.line
		);
	});
};
