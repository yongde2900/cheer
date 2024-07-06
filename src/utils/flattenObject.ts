export const flattenObject = (obj: any, parentKey = '', result: any = {}) => {
	for (const key in obj) {
		const newKey = parentKey ? `${parentKey}.${key}` : key;
		if (typeof obj[key] === 'object' && obj[key] !== null) {
			flattenObject(obj[key], newKey, result);
		} else {
			result[newKey] = obj[key];
		}
	}

	return result;
};
