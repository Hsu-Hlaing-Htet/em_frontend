/**
 * Myanmar NRC reference data for Admin Staff/Resident forms.
 * Township codes use the TitleCase short form stored by the API
 * (e.g. 12/YaKaNa(N)111001).
 */

export const NRC_NUMBER_LENGTH = 6;

/** Citizenship / NRC type codes used in stored NRC strings. */
export const NRC_TYPE_OPTIONS = [
    { label: 'N', value: 'N' },
    { label: 'E', value: 'E' },
    { label: 'P', value: 'P' },
];

export const NRC_STATE_OPTIONS = [
    { code: '1', label: '1', name: 'Kachin' },
    { code: '2', label: '2', name: 'Kayah' },
    { code: '3', label: '3', name: 'Kayin' },
    { code: '4', label: '4', name: 'Chin' },
    { code: '5', label: '5', name: 'Sagaing' },
    { code: '6', label: '6', name: 'Tanintharyi' },
    { code: '7', label: '7', name: 'Bago' },
    { code: '8', label: '8', name: 'Magway' },
    { code: '9', label: '9', name: 'Mandalay' },
    { code: '10', label: '10', name: 'Mon' },
    { code: '11', label: '11', name: 'Rakhine' },
    { code: '12', label: '12', name: 'Yangon' },
    { code: '13', label: '13', name: 'Shan' },
    { code: '14', label: '14', name: 'Ayeyarwady' },
];

/** @type {Record<string, string[]>} */
export const NRC_TOWNSHIPS_BY_STATE = {
    '1': [
        'AhGaYa', 'BaMaNa', 'DaPhaYa', 'HaPaNa', 'KaMaNa', 'KaMaTa', 'KaPaTa', 'KhaLaPha',
        'KhaPhaNa', 'LaGaNa', 'MaKaNa', 'MaKaTa', 'MaKhaBa', 'MaLaNa', 'MaMaNa', 'MaNyaNa',
        'MaSaNa', 'NaMaNa', 'PaNaDa', 'PaTaAh', 'PaWaNa', 'PhaKaNa', 'SaBaNa', 'SaDaNa',
        'SaLaNa', 'SaPaBa', 'TaNaNa', 'WaMaNa', 'YaBaYa', 'YaKaNa',
    ],
    '2': [
        'BaLaKha', 'DaMaSa', 'LaKaNa', 'MaSaNa', 'PhaSaNa', 'PhaYaSa', 'YaTaNa', 'YaThaNa',
    ],
    '3': [
        'BaAhNa', 'BaGaLa', 'BaThaSa', 'KaDaNa', 'KaKaYa', 'KaMaMa', 'KaSaKa', 'LaBaNa',
        'LaThaNa', 'MaWaTa', 'PhaAhNa', 'PhaPaNa', 'SaKaLa', 'ThaTaKa', 'ThaTaNa', 'WaLaMa',
        'YaYaTha',
    ],
    '4': [
        'HaKhaNa', 'HtaTaLa', 'KaKhaNa', 'KaPaLa', 'MaTaNa', 'MaTaPa', 'PaLaWa', 'PhaLaNa',
        'SaMaNa', 'TaTaNa', 'TaZaNa', 'YaKhaDa', 'YaZaNa',
    ],
    '5': [
        'AhTaNa', 'AhYaTa', 'BaMaNa', 'BaTaLa', 'DaHaNa', 'DaPaYa', 'HaMaLa', 'HtaKhaNa',
        'HtaPaKha', 'KaBaLa', 'KaLaHta', 'KaLaNa', 'KaLaTa', 'KaLaWa', 'KaMaNa', 'KaNaNa',
        'KaThaNa', 'KhaOuNa', 'KhaOuTa', 'KhaPaNa', 'KhaTaNa', 'LaHaNa', 'LaYaNa', 'MaKaNa',
        'MaLaNa', 'MaMaNa', 'MaPaLa', 'MaThaNa', 'MaYaNa', 'NaYaNa', 'NgaZaNa', 'PaLaNa',
        'PaLanBa', 'PaSaNa', 'PhaPaNa', 'SaKaNa', 'SaLaKa', 'SaMaYa', 'TaMaNa', 'TaSaNa',
        'WaLaNa', 'WaThaNa', 'YaBaNa', 'YaMaPa', 'YaOuNa', 'YaThaKa',
    ],
    '6': [
        'BaPaNa', 'HtaWaNa', 'KaLaAh', 'KaSaNa', 'KaThaNa', 'KaYaYa', 'KhaMaKa', 'LaLaNa',
        'MaAhNa', 'MaAhYa', 'MaMaNa', 'NgaYaKa', 'PaKaMa', 'PaLaNa', 'PaLaTa', 'TaNaTha',
        'TaThaYa', 'ThaYaKha', 'YaPhaNa',
    ],
    '7': [
        'AhPhaNa', 'AhTaNa', 'DaOuNa', 'HtaTaPa', 'KaKaNa', 'KaPaKa', 'KaTaKha', 'KaTaTa',
        'KaWaNa', 'LaPATa', 'MaDaNa', 'MaLaNa', 'MaNyaNa', 'NaTaLa', 'NyaLaPa', 'PaKhaNa',
        'PaKhaTa', 'PaMaNa', 'PaNaKa', 'PaTaLa', 'PaTaNa', 'PaTaSa', 'PaTaTa', 'PhaMaNa',
        'TaNgaNa', 'ThaKaNa', 'ThaNaPa', 'ThaSaNa', 'ThaWaTa', 'WaMaNa', 'YaKaNa', 'YaTaNa',
        'YaTaYa', 'ZaKaNa',
    ],
    '8': [
        'AhLaNa', 'GaGaNa', 'HtaLaNa', 'KaHtaNa', 'KaMaNa', 'KhaMaNa', 'MaBaNa', 'MaHtaNa',
        'MaKaNa', 'MaLaNa', 'MaMaNa', 'MaTaNa', 'MaThaNa', 'NaMaNa', 'NgaPhaNa', 'PaKhaKa',
        'PaMaNa', 'PaPhaNa', 'SaKaNa', 'SaLaNa', 'SaMaNa', 'SaPaWa', 'SaPhaNa', 'SaTaYa',
        'TaTaKa', 'ThaYaNa', 'YaNaKha', 'YaSaKa',
    ],
    '9': [
        'AhMaYa', 'AhMaZa', 'DaKhaTha', 'KaPaTa', 'KaSaNa', 'KhAaHsa', 'KhaAhZa', 'KhaMaSa',
        'LaWaNa', 'MaHaMa', 'MaHtaLa', 'MaKaNa', 'MaKhaNa', 'MaLaNa', 'MaMaNa', 'MaNaMa',
        'MaNaTa', 'MaTaYa', 'MaThaNa', 'MaYaMa', 'MaYaTa', 'NaHtaKa', 'NgaTaYa', 'NgaZaNa',
        'NyaOuNa', 'OoTaYa', 'OuTaTha', 'PaBaNa', 'PaBaTha', 'PaKaKha', 'PaLaNa', 'PaMaNa',
        'PaOuLa', 'PaThaKa', 'SaKaNa', 'SaKaTa', 'TaKaNa', 'TaTaOu', 'TaThaNa', 'ThaPaKa',
        'ThaSaNa', 'WaTaNa', 'YaMaTha', 'ZaBaTha', 'ZaYaTha',
    ],
    '10': [
        'BaLaNa', 'KaHtaNa', 'KaKhaMa', 'KaMaYa', 'KhaSaNa', 'KhaZaNa', 'LaMaNa', 'MaDaNa',
        'MaLaMa', 'PaMaNa', 'ThaHtaNa', 'ThaPhaYa', 'YaMaNa',
    ],
    '11': [
        'AaMaNa', 'BaThaTa', 'GaMaNa', 'KaPhaNa', 'KaTaLa', 'KaTaNa', 'MaAhNa', 'MaAhTa',
        'MaOuNa', 'MaPaNa', 'MaPaTa', 'MaTaNa', 'PaNaKa', 'PaTaNa', 'SaTaNa', 'TaKaNa',
        'TaPaWa', 'ThaTaNa', 'YaBaNa', 'YaThaTa',
    ],
    '12': [
        'AaLaNa', 'AhSaNa', 'BaHaNa', 'BaKaTa', 'BaTaHta', 'DaGaMa', 'DaGaNa', 'DaGaTa',
        'DaGaYa', 'DaLaNa', 'DaPaNa', 'DaSaKa', 'HtaTaPa', 'KaKaKa', 'KaKhaKa', 'KaMaNa',
        'KaMaTa', 'KaMaYa', 'KaTaNa', 'KaTaTa', 'KhaYaNa', 'LaKaNa', 'LaMaNa', 'LaMata',
        'LaThaNa', 'LaThaYa', 'MaBaNa', 'MaGaDa', 'MaGaTa', 'MaNyaTa', 'MaYaKa', 'OuKaMa',
        'OuKaTa', 'PaBaTa', 'PaZaDa', 'SaKakha', 'SaKaNa', 'SaKhaNa', 'TaKaNa', 'TaMaNa',
        'TaTaHta', 'TaTaNa', 'ThaGaKa', 'ThaKaTa', 'ThaKhaNa', 'ThaLaNa', 'YaKaNa', 'YaPaKa',
        'YaPaTha',
    ],
    '13': [
        'AhPaNa', 'AhTaNa', 'AhTaYa', 'HaHaNa', 'HaMaNa', 'HaPaNa', 'HaPaTa', 'KaHaNa',
        'KaKhaNa', 'KaLaHta', 'KaLaNa', 'KaLaTa', 'KaMaNa', 'KaTaNa', 'KaTaTa', 'KaThaNa',
        'KhaYaHa', 'LaKaNa', 'LaKhaNa', 'LaKhaTa', 'LaLaNa', 'LaYaNa', 'MaBaNa', 'MaHtaNa',
        'MaKaNa', 'MaKhaNa', 'MaKhaTa', 'MaMaTa', 'MaNaNa', 'MaNgaNa', 'MaPaTa', 'MaPhaHta',
        'MaPHaNa', 'MaSaNa', 'MaSaTa', 'MaTaTa', 'MaYaNa', 'MaYaTa', 'NaKhaNa', 'NaKhaTa',
        'NaMaTa', 'NaPaNa', 'NaSaNa', 'NaTaYa', 'NyaYaNa', 'PaLaNa', 'PaPaKa', 'PaTaYa',
        'PaWaNa', 'PhaKhaNa', 'SaSaNa', 'TaKaNa', 'TaKhaLa', 'TaLaNa', 'TaMaNya', 'TaTaNa',
        'TaYaNa', 'ThaNaNa', 'ThaPaNa', 'YaNgaNa', 'YaNyaNa', 'YaSaNa',
    ],
    '14': [
        'AhGaPa', 'AhMaNa', 'AhMaTa', 'BaKaLa', 'DaDaYa', 'DaNaPha', 'HaKaKa', 'HaThaTa',
        'KaKaHta', 'KaKaNa', 'KaKhaNa', 'KaLaNa', 'KaNaNa', 'KaPaNa', 'LaMaNa', 'LaPaTa',
        'MaAhaNa', 'MaAhPa', 'MaMaKa', 'MaMaNa', 'NgaPaTa', 'NgaThaKha', 'NgaYaKa', 'NyaTaNa',
        'PaSaLa', 'PaTaNa', 'PaThaNa', 'PaThaYa', 'PhaPaNa', 'ThaPaNa', 'WaKhaMa', 'YaKaNa',
        'YaThaYa', 'ZaLaNa',
    ],
};

export function normalizeNrcStateCode(stateCode) {
    if (stateCode == null || stateCode === '') {
        return null;
    }

    if (typeof stateCode === 'object' && stateCode.code != null) {
        return String(stateCode.code);
    }

    const normalized = String(stateCode).trim();

    return normalized === '' ? null : normalized;
}

export function getNrcTownshipOptions(stateCode) {
    const normalized = normalizeNrcStateCode(stateCode);
    const codes = normalized ? (NRC_TOWNSHIPS_BY_STATE[normalized] || []) : [];

    return codes.map((code) => ({ label: code, value: code }));
}

export function isValidNrcTownship(stateCode, townshipCode) {
    const normalized = normalizeNrcStateCode(stateCode);
    const codes = normalized ? (NRC_TOWNSHIPS_BY_STATE[normalized] || []) : [];

    return codes.includes(String(townshipCode || ''));
}

