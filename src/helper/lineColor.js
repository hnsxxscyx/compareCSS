const EXTRA_COLOR = 'green';
const DIFF_COLOR = 'yellow';
const Error_COLOR = 'red';

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
		}
		case 'Error': {
			info.color = Error_COLOR;
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

export const getSyntaxErrorColors = (errorList) => {
	console.log(errorList);
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
