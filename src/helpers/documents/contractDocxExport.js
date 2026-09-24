import { downloadBlob } from '@/utils/downloadFile';
import {
    buildDocumentAuthorizationRows,
    buildFinancialRows,
    buildPropertyLocationRows,
} from './contractDocumentRows';
import { COMPANY_INFO } from './companyInfo';

const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

function xmlEscape(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function hasValue(value) {
    return value !== null && value !== undefined && String(value).trim() !== '' && String(value).trim() !== '-';
}

function valueOrDash(value) {
    return hasValue(value) ? String(value) : '-';
}

function paragraph(text = '', style = '') {
    const styleXml = style ? `<w:pStyle w:val="${style}"/>` : '';

    return `
        <w:p>
            <w:pPr>${styleXml}</w:pPr>
            <w:r><w:t xml:space="preserve">${xmlEscape(text)}</w:t></w:r>
        </w:p>
    `;
}

function boldParagraph(text = '') {
    return `
        <w:p>
            <w:r><w:rPr><w:b/></w:rPr><w:t xml:space="preserve">${xmlEscape(text)}</w:t></w:r>
        </w:p>
    `;
}

function cell(contentXml, width = 4500) {
    return `
        <w:tc>
            <w:tcPr><w:tcW w:w="${width}" w:type="dxa"/></w:tcPr>
            ${contentXml}
        </w:tc>
    `;
}

function textCell(text, width) {
    return cell(paragraph(valueOrDash(text)), width);
}

function row(cells) {
    return `<w:tr>${cells.join('')}</w:tr>`;
}

function table(rowsXml, width = 9000) {
    return `
        <w:tbl>
            <w:tblPr>
                <w:tblW w:w="${width}" w:type="dxa"/>
                <w:tblBorders>
                    <w:top w:val="single" w:sz="4" w:space="0" w:color="D8D2CC"/>
                    <w:left w:val="single" w:sz="4" w:space="0" w:color="D8D2CC"/>
                    <w:bottom w:val="single" w:sz="4" w:space="0" w:color="D8D2CC"/>
                    <w:right w:val="single" w:sz="4" w:space="0" w:color="D8D2CC"/>
                    <w:insideH w:val="single" w:sz="4" w:space="0" w:color="E8E2DC"/>
                    <w:insideV w:val="single" w:sz="4" w:space="0" w:color="E8E2DC"/>
                </w:tblBorders>
            </w:tblPr>
            ${rowsXml}
        </w:tbl>
    `;
}

function labelValueTable(items = []) {
    const rowsXml = items
        .filter((item) => hasValue(item?.value))
        .map((item) => row([
            cell(boldParagraph(item.label), 3500),
            textCell(item.value, 5500),
        ]))
        .join('');

    return rowsXml ? table(rowsXml) : paragraph('-');
}

function section(title, bodyXml) {
    return `${paragraph(title, 'Heading2')}${bodyXml}`;
}

function partyTable(document, variant) {
    const formatPartyLines = (fields = []) => {
        const byLabel = Object.fromEntries(
            (fields || [])
                .filter((item) => item.label !== 'Address' && hasValue(item.value))
                .map((item) => [item.label, item.value]),
        );

        return [
            byLabel['Full Name'],
            byLabel['NRC / ID'],
            byLabel.Phone,
            byLabel.Email,
        ].filter(hasValue).join('\n');
    };

    const customerLines = formatPartyLines(document.customer);
    const secondCustomerLines = formatPartyLines(document.secondCustomer);
    const hasSecondCustomer = Boolean(secondCustomerLines);

    const companyLines = [
        COMPANY_INFO.name,
        COMPANY_INFO.registration,
        COMPANY_INFO.address,
        `Phone: ${COMPANY_INFO.phone}`,
        `Email: ${COMPANY_INFO.email}`,
        `Website: ${COMPANY_INFO.website}`,
    ].filter(hasValue).join('\n');

    const ownerBody = hasSecondCustomer
        ? table(row([
            cell(paragraph(customerLines), 2250),
            cell(paragraph(secondCustomerLines), 2250),
        ]))
        : paragraph(customerLines);

    return table(row([
        cell(`${boldParagraph(variant.companyRole)}${paragraph(companyLines)}`, 4500),
        cell(`${boldParagraph(variant.customerRole)}${ownerBody}`, 4500),
    ]));
}

function covenantList(items = []) {
    const entries = items.filter(hasValue);

    if (!entries.length) {
        return paragraph('-');
    }

    return entries.map((item) => paragraph(item, 'ListParagraph')).join('');
}

function signatureTable(document) {
    const signatures = Array.isArray(document.signatures) && document.signatures.length
        ? document.signatures
        : [
            { role: 'Customer', label: 'Customer', name: '' },
            { role: 'Authorized Officer', label: 'Company Representative', name: '' },
        ];

    const groups = [];
    signatures.forEach((signature) => {
        const isCompany = /authorized officer|company representative|company|seller|landlord/i
            .test(`${signature.role || ''} ${signature.label || ''}`);
        const roleKey = isCompany ? 'company' : String(signature.role || signature.label || 'Signature');
        const last = groups[groups.length - 1];

        if (last && last.roleKey === roleKey && !isCompany) {
            last.parties.push(signature);
            return;
        }

        groups.push({
            roleKey,
            heading: isCompany
                ? (signature.label || 'Company Representative')
                : (signature.role || signature.label || 'Signature'),
            parties: [signature],
        });
    });

    return groups.map((group) => {
        const width = Math.floor(9000 / group.parties.length);

        return [
            boldParagraph(group.heading),
            table(row(group.parties.map((party) => cell(
                `${paragraph('______________________________')}${paragraph(`Name: ${valueOrDash(party.name)}`)}${paragraph('Date: ')}`,
                width,
            )))),
            paragraph(''),
        ].join('');
    }).join('');
}

function documentXml(document, variant) {
    const contractNo = document?.header?.contractNo || '';
    const issueDate = document?.header?.issuedDate || '';
    const propertyRows = buildPropertyLocationRows(document);
    const financialRows = buildFinancialRows(document, variant);
    const authorizationRows = buildDocumentAuthorizationRows(document);
    const covenants = [
        variant.customerObligation,
        variant.companyObligation,
        document?.remarks ? `Remarks: ${document.remarks}` : '',
    ];

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:body>
        ${paragraph(COMPANY_INFO.name, 'Title')}
        ${paragraph(COMPANY_INFO.tagline)}
        ${paragraph(`${variant.documentTitle} ${contractNo}`.trim(), 'Heading1')}
        ${table(row([
            textCell(`Contract No. ${valueOrDash(contractNo)}`, 4500),
            textCell(`Issue Date ${valueOrDash(issueDate)}`, 4500),
        ]))}
        ${paragraph(variant.introduction)}
        ${section('I. Parties to the Agreement', partyTable(document, variant))}
        ${section('II. Property', labelValueTable(propertyRows.length ? propertyRows : document.property))}
        ${section('III. Term and Financial Conditions', labelValueTable(financialRows))}
        ${section('IV. General Covenants', covenantList(covenants))}
        ${authorizationRows.length ? section('V. Document Authorization', labelValueTable(authorizationRows)) : ''}
        ${section('VI. Execution', `${paragraph(`IN WITNESS WHEREOF, the parties hereto have executed this ${variant.agreementName} as of the date first written above.`)}${signatureTable(document)}`)}
        <w:sectPr>
            <w:pgSz w:w="11906" w:h="16838"/>
            <w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="708" w:footer="708" w:gutter="0"/>
        </w:sectPr>
    </w:body>
</w:document>`;
}

const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
        <w:name w:val="Normal"/>
        <w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="21"/></w:rPr>
        <w:pPr><w:spacing w:after="120" w:line="276" w:lineRule="auto"/></w:pPr>
    </w:style>
    <w:style w:type="paragraph" w:styleId="Title">
        <w:name w:val="Title"/>
        <w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:b/><w:sz w:val="32"/><w:color w:val="3B2F2A"/></w:rPr>
        <w:pPr><w:jc w:val="center"/><w:spacing w:after="80"/></w:pPr>
    </w:style>
    <w:style w:type="paragraph" w:styleId="Heading1">
        <w:name w:val="heading 1"/>
        <w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:b/><w:sz w:val="28"/><w:color w:val="6D4C41"/></w:rPr>
        <w:pPr><w:jc w:val="center"/><w:spacing w:before="160" w:after="180"/></w:pPr>
    </w:style>
    <w:style w:type="paragraph" w:styleId="Heading2">
        <w:name w:val="heading 2"/>
        <w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:b/><w:sz w:val="22"/><w:color w:val="3B2F2A"/></w:rPr>
        <w:pPr><w:spacing w:before="220" w:after="100"/></w:pPr>
    </w:style>
    <w:style w:type="paragraph" w:styleId="ListParagraph">
        <w:name w:val="List Paragraph"/>
        <w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="21"/></w:rPr>
        <w:pPr><w:ind w:left="360"/><w:spacing w:after="100"/></w:pPr>
    </w:style>
</w:styles>`;

const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
    <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
    <Default Extension="xml" ContentType="application/xml"/>
    <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
    <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`;

const relationshipsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

const documentRelationshipsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

function crc32(bytes) {
    let crc = -1;

    for (let i = 0; i < bytes.length; i += 1) {
        crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ bytes[i]) & 0xff];
    }

    return (crc ^ -1) >>> 0;
}

const CRC_TABLE = Array.from({ length: 256 }, (_, index) => {
    let value = index;

    for (let bit = 0; bit < 8; bit += 1) {
        value = (value & 1) ? (0xedb88320 ^ (value >>> 1)) : (value >>> 1);
    }

    return value >>> 0;
});

function writeUint16(bytes, value) {
    bytes.push(value & 0xff, (value >>> 8) & 0xff);
}

function writeUint32(bytes, value) {
    bytes.push(value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff);
}

function writeBytes(bytes, values) {
    bytes.push(...values);
}

function createZip(files) {
    const encoder = new TextEncoder();
    const bytes = [];
    const centralDirectory = [];

    files.forEach((file) => {
        const nameBytes = encoder.encode(file.name);
        const contentBytes = encoder.encode(file.content);
        const checksum = crc32(contentBytes);
        const offset = bytes.length;

        writeUint32(bytes, 0x04034b50);
        writeUint16(bytes, 20);
        writeUint16(bytes, 0);
        writeUint16(bytes, 0);
        writeUint16(bytes, 0);
        writeUint16(bytes, 0);
        writeUint32(bytes, checksum);
        writeUint32(bytes, contentBytes.length);
        writeUint32(bytes, contentBytes.length);
        writeUint16(bytes, nameBytes.length);
        writeUint16(bytes, 0);
        writeBytes(bytes, nameBytes);
        writeBytes(bytes, contentBytes);

        centralDirectory.push({ file, nameBytes, contentBytes, checksum, offset });
    });

    const centralDirectoryOffset = bytes.length;

    centralDirectory.forEach(({ nameBytes, contentBytes, checksum, offset }) => {
        writeUint32(bytes, 0x02014b50);
        writeUint16(bytes, 20);
        writeUint16(bytes, 20);
        writeUint16(bytes, 0);
        writeUint16(bytes, 0);
        writeUint16(bytes, 0);
        writeUint16(bytes, 0);
        writeUint32(bytes, checksum);
        writeUint32(bytes, contentBytes.length);
        writeUint32(bytes, contentBytes.length);
        writeUint16(bytes, nameBytes.length);
        writeUint16(bytes, 0);
        writeUint16(bytes, 0);
        writeUint16(bytes, 0);
        writeUint16(bytes, 0);
        writeUint32(bytes, 0);
        writeUint32(bytes, offset);
        writeBytes(bytes, nameBytes);
    });

    const centralDirectorySize = bytes.length - centralDirectoryOffset;

    writeUint32(bytes, 0x06054b50);
    writeUint16(bytes, 0);
    writeUint16(bytes, 0);
    writeUint16(bytes, centralDirectory.length);
    writeUint16(bytes, centralDirectory.length);
    writeUint32(bytes, centralDirectorySize);
    writeUint32(bytes, centralDirectoryOffset);
    writeUint16(bytes, 0);

    return new Blob([new Uint8Array(bytes)], { type: DOCX_MIME });
}

function createDocxBlob(document, variant) {
    return createZip([
        { name: '[Content_Types].xml', content: contentTypesXml },
        { name: '_rels/.rels', content: relationshipsXml },
        { name: 'word/_rels/document.xml.rels', content: documentRelationshipsXml },
        { name: 'word/document.xml', content: documentXml(document, variant) },
        { name: 'word/styles.xml', content: stylesXml },
    ]);
}

function cleanDocxFilename(document, type) {
    const label = type === 'rent' ? 'Rent' : 'Sale';
    const prefix = type === 'rent' ? 'R' : 'S';
    const contractNo = document?.header?.contractNo || `${prefix}-000000`;

    return `Rosewood_Royale_${label}_Contract_${contractNo}.docx`;
}

const saleVariant = {
    kind: 'sale',
    documentTitle: 'Property Sale Agreement',
    agreementName: 'Property Sale Agreement',
    companyRole: 'Seller',
    customerRole: 'Owner',
    introduction: 'This Property Sale Agreement records the principal terms agreed between Rosewood Royale Residences and the owner named below.',
    customerObligation: 'The owner agrees to pay all amounts due under the selected payment plan and comply with residence rules and handover requirements.',
    companyObligation: 'Rosewood Royale Residences agrees to transfer possession and related documentation according to the approved sale contract terms.',
};

const rentVariant = {
    kind: 'rent',
    documentTitle: 'Rental/Lease Agreement',
    agreementName: 'Rental/Lease Agreement',
    companyRole: 'Landlord',
    customerRole: 'Tenant',
    introduction: 'This Rental/Lease Agreement records the principal terms agreed between Rosewood Royale Residences and the tenant named below.',
    customerObligation: 'The tenant agrees to pay rent and related charges on time and maintain the unit according to residence rules.',
    companyObligation: 'Rosewood Royale Residences agrees to provide use of the premises for the approved lease period according to the rent contract terms.',
};

export function downloadSaleContractDocx(document) {
    downloadBlob(cleanDocxFilename(document, 'sale'), createDocxBlob(document, saleVariant));
}

export function downloadRentContractDocx(document) {
    downloadBlob(cleanDocxFilename(document, 'rent'), createDocxBlob(document, rentVariant));
}
