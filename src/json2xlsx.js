import JSZip from 'jszip';
import FileSaver from 'file-saver';

import validator from './validator';
import generatorRows from './formatters/rows/generatorRows';

import workbookXML from './statics/workbook.xml';
import workbookXMLRels from './statics/workbook.xml.rels';
import rels from './statics/rels';
import contentTypes from './statics/[Content_Types].xml';
import templateSheet from './templates/worksheet.xml';

export const generateXMLWorksheet = (rows) => {
  const XMLRows = generatorRows(rows);
  return templateSheet.replace('{placeholder}', XMLRows);
};

export default (config) => {
	if (!validator(config)) {
		return;
	}

	const zip = new JSZip();
	const xl = zip.folder('xl');
	xl.file('workbook.xml', workbookXML);
	xl.file('_rels/workbook.xml.rels', workbookXMLRels);
	zip.file('_rels/.rels', rels);
	zip.file('[Content_Types].xml', contentTypes);
	config.sheets.map(sheet => { 
		let worksheet = generateXMLWorksheet(sheet.data); 
		xl.file('worksheets/'+sheet.name+'.xml', worksheet);
	})

	zip.generateAsync({ type: 'blob' })
	.then((blob) => {
		FileSaver.saveAs(blob, `${config.filename}.xlsx`);
	});
};