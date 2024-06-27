/* eslint-disable @typescript-eslint/no-explicit-any */
export let locale = "de-DE";

export const currencyFormatter = (value: any, currency: string) => {
	if (currency === 'EUR') locale = "de-DE"
	const res = new Intl.NumberFormat(locale, {
		style: "currency",
		currency: currency
	}).format(value).replace(/€|\s/g, '');
	return res
};

export const currencyParser = (val: any) => {
	try {
		// for when the input gets clears
		if (typeof val === "string" && !val.length) {
			val = undefined;
		}

		// detecting and parsing between comma and dot
		const group = new Intl.NumberFormat(locale).format(1111).replace(/1/g, "");
		const decimal = new Intl.NumberFormat(locale).format(1.1).replace(/1/g, "");

		if (val) {
			let reversedVal = val.replace(new RegExp("\\" + group, "g"), "");
			reversedVal = reversedVal.replace(new RegExp("\\" + decimal, "g"), ".");
			//  => 1232.21 €

			// removing everything except the digits and dot
			reversedVal = reversedVal.replace(/[^0-9.]/g, "");
			//  => 1232.21

			// appending digits properly
			const digitsAfterDecimalCount = (reversedVal.split(".")[1] || []).length;
			const needsDigitsAppended = digitsAfterDecimalCount > 2;

			if (needsDigitsAppended) {
				reversedVal = reversedVal * Math.pow(10, digitsAfterDecimalCount - 2);
			}

			return Number.isNaN(reversedVal) ? 0 : reversedVal;
		}
	} catch (error) {
		console.error(error);
	}
};