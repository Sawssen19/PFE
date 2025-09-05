import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Menu, MenuItem, Typography, InputAdornment } from '@mui/material';
import { KeyboardArrowDown, Phone } from '@mui/icons-material';

// Liste des pays avec indicatifs téléphoniques (Tunisie en premier)
const countries = [
  { code: 'TN', name: 'Tunisie', dialCode: '+216', flag: '🇹🇳' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'DZ', name: 'Algérie', dialCode: '+213', flag: '🇩🇿' },
  { code: 'MA', name: 'Maroc', dialCode: '+212', flag: '🇲🇦' },
  { code: 'EG', name: 'Égypte', dialCode: '+20', flag: '🇪🇬' },
  { code: 'LY', name: 'Libye', dialCode: '+218', flag: '🇱🇾' },
  { code: 'US', name: 'États-Unis', dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'Royaume-Uni', dialCode: '+44', flag: '🇬🇧' },
  { code: 'DE', name: 'Allemagne', dialCode: '+49', flag: '🇩🇪' },
  { code: 'IT', name: 'Italie', dialCode: '+39', flag: '🇮🇹' },
  { code: 'ES', name: 'Espagne', dialCode: '+34', flag: '🇪🇸' },
  { code: 'BE', name: 'Belgique', dialCode: '+32', flag: '🇧🇪' },
  { code: 'CH', name: 'Suisse', dialCode: '+41', flag: '🇨🇭' },
  { code: 'NL', name: 'Pays-Bas', dialCode: '+31', flag: '🇳🇱' },
  { code: 'SE', name: 'Suède', dialCode: '+46', flag: '🇸🇪' },
  { code: 'NO', name: 'Norvège', dialCode: '+47', flag: '🇳🇴' },
  { code: 'DK', name: 'Danemark', dialCode: '+45', flag: '🇩🇰' },
  { code: 'FI', name: 'Finlande', dialCode: '+358', flag: '🇫🇮' },
  { code: 'PL', name: 'Pologne', dialCode: '+48', flag: '🇵🇱' },
  { code: 'CZ', name: 'République tchèque', dialCode: '+420', flag: '🇨🇿' },
  { code: 'AT', name: 'Autriche', dialCode: '+43', flag: '🇦🇹' },
  { code: 'HU', name: 'Hongrie', dialCode: '+36', flag: '🇭🇺' },
  { code: 'RO', name: 'Roumanie', dialCode: '+40', flag: '🇷🇴' },
  { code: 'BG', name: 'Bulgarie', dialCode: '+359', flag: '🇧🇬' },
  { code: 'HR', name: 'Croatie', dialCode: '+385', flag: '🇭🇷' },
  { code: 'SI', name: 'Slovénie', dialCode: '+386', flag: '🇸🇮' },
  { code: 'SK', name: 'Slovaquie', dialCode: '+421', flag: '🇸🇰' },
  { code: 'LT', name: 'Lituanie', dialCode: '+370', flag: '🇱🇹' },
  { code: 'LV', name: 'Lettonie', dialCode: '+371', flag: '🇱🇻' },
  { code: 'EE', name: 'Estonie', dialCode: '+372', flag: '🇪🇪' },
  { code: 'IE', name: 'Irlande', dialCode: '+353', flag: '🇮🇪' },
  { code: 'PT', name: 'Portugal', dialCode: '+351', flag: '🇵🇹' },
  { code: 'GR', name: 'Grèce', dialCode: '+30', flag: '🇬🇷' },
  { code: 'TR', name: 'Turquie', dialCode: '+90', flag: '🇹🇷' },
  { code: 'RU', name: 'Russie', dialCode: '+7', flag: '🇷🇺' },
  { code: 'UA', name: 'Ukraine', dialCode: '+380', flag: '🇺🇦' },
  { code: 'BY', name: 'Biélorussie', dialCode: '+375', flag: '🇧🇾' },
  { code: 'MD', name: 'Moldavie', dialCode: '+373', flag: '🇲🇩' },
  { code: 'GE', name: 'Géorgie', dialCode: '+995', flag: '🇬🇪' },
  { code: 'AM', name: 'Arménie', dialCode: '+374', flag: '🇦🇲' },
  { code: 'AZ', name: 'Azerbaïdjan', dialCode: '+994', flag: '🇦🇿' },
  { code: 'UZ', name: 'Ouzbékistan', dialCode: '+998', flag: '🇺🇿' },
  { code: 'KG', name: 'Kirghizistan', dialCode: '+996', flag: '🇰🇬' },
  { code: 'TJ', name: 'Tadjikistan', dialCode: '+992', flag: '🇹🇯' },
  { code: 'TM', name: 'Turkménistan', dialCode: '+993', flag: '🇹🇲' },
  { code: 'AF', name: 'Afghanistan', dialCode: '+93', flag: '🇦🇫' },
  { code: 'PK', name: 'Pakistan', dialCode: '+92', flag: '🇵🇰' },
  { code: 'IN', name: 'Inde', dialCode: '+91', flag: '🇮🇳' },
  { code: 'BD', name: 'Bangladesh', dialCode: '+880', flag: '🇧🇩' },
  { code: 'LK', name: 'Sri Lanka', dialCode: '+94', flag: '🇱🇰' },
  { code: 'NP', name: 'Népal', dialCode: '+977', flag: '🇳🇵' },
  { code: 'BT', name: 'Bhoutan', dialCode: '+975', flag: '🇧🇹' },
  { code: 'MM', name: 'Myanmar', dialCode: '+95', flag: '🇲🇲' },
  { code: 'TH', name: 'Thaïlande', dialCode: '+66', flag: '🇹🇭' },
  { code: 'LA', name: 'Laos', dialCode: '+856', flag: '🇱🇦' },
  { code: 'KH', name: 'Cambodge', dialCode: '+855', flag: '🇰🇭' },
  { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳' },
  { code: 'MY', name: 'Malaisie', dialCode: '+60', flag: '🇲🇾' },
  { code: 'SG', name: 'Singapour', dialCode: '+65', flag: '🇸🇬' },
  { code: 'ID', name: 'Indonésie', dialCode: '+62', flag: '🇮🇩' },
  { code: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭' },
  { code: 'JP', name: 'Japon', dialCode: '+81', flag: '🇯🇵' },
  { code: 'KR', name: 'Corée du Sud', dialCode: '+82', flag: '🇰🇷' },
  { code: 'CN', name: 'Chine', dialCode: '+86', flag: '🇨🇳' },
  { code: 'TW', name: 'Taïwan', dialCode: '+886', flag: '🇹🇼' },
  { code: 'HK', name: 'Hong Kong', dialCode: '+852', flag: '🇭🇰' },
  { code: 'MO', name: 'Macao', dialCode: '+853', flag: '🇲🇴' },
  { code: 'AU', name: 'Australie', dialCode: '+61', flag: '🇦🇺' },
  { code: 'NZ', name: 'Nouvelle-Zélande', dialCode: '+64', flag: '🇳🇿' },
  { code: 'BR', name: 'Brésil', dialCode: '+55', flag: '🇧🇷' },
  { code: 'AR', name: 'Argentine', dialCode: '+54', flag: '🇦🇷' },
  { code: 'CL', name: 'Chili', dialCode: '+56', flag: '🇨🇱' },
  { code: 'CO', name: 'Colombie', dialCode: '+57', flag: '🇨🇴' },
  { code: 'PE', name: 'Pérou', dialCode: '+51', flag: '🇵🇪' },
  { code: 'VE', name: 'Venezuela', dialCode: '+58', flag: '🇻🇪' },
  { code: 'EC', name: 'Équateur', dialCode: '+593', flag: '🇪🇨' },
  { code: 'BO', name: 'Bolivie', dialCode: '+591', flag: '🇧🇴' },
  { code: 'PY', name: 'Paraguay', dialCode: '+595', flag: '🇵🇾' },
  { code: 'UY', name: 'Uruguay', dialCode: '+598', flag: '🇺🇾' },
  { code: 'MX', name: 'Mexique', dialCode: '+52', flag: '🇲🇽' },
  { code: 'CU', name: 'Cuba', dialCode: '+53', flag: '🇨🇺' },
  { code: 'JM', name: 'Jamaïque', dialCode: '+1876', flag: '🇯🇲' },
  { code: 'HT', name: 'Haïti', dialCode: '+509', flag: '🇭🇹' },
  { code: 'DO', name: 'République dominicaine', dialCode: '+1809', flag: '🇩🇴' },
  { code: 'PR', name: 'Porto Rico', dialCode: '+1787', flag: '🇵🇷' },
  { code: 'TT', name: 'Trinité-et-Tobago', dialCode: '+1868', flag: '🇹🇹' },
  { code: 'BB', name: 'Barbade', dialCode: '+1246', flag: '🇧🇧' },
  { code: 'GD', name: 'Grenade', dialCode: '+1473', flag: '🇬🇩' },
  { code: 'LC', name: 'Sainte-Lucie', dialCode: '+1758', flag: '🇱🇨' },
  { code: 'VC', name: 'Saint-Vincent-et-les-Grenadines', dialCode: '+1784', flag: '🇻🇨' },
  { code: 'AG', name: 'Antigua-et-Barbuda', dialCode: '+1268', flag: '🇦🇬' },
  { code: 'KN', name: 'Saint-Kitts-et-Nevis', dialCode: '+1869', flag: '🇰🇳' },
  { code: 'DM', name: 'Dominique', dialCode: '+1767', flag: '🇩🇲' },
  { code: 'MQ', name: 'Martinique', dialCode: '+596', flag: '🇲🇶' },
  { code: 'GP', name: 'Guadeloupe', dialCode: '+590', flag: '🇬🇵' },
  { code: 'RE', name: 'Réunion', dialCode: '+262', flag: '🇷🇪' },
  { code: 'YT', name: 'Mayotte', dialCode: '+262', flag: '🇾🇹' },
  { code: 'NC', name: 'Nouvelle-Calédonie', dialCode: '+687', flag: '🇳🇨' },
  { code: 'PF', name: 'Polynésie française', dialCode: '+689', flag: '🇵🇫' },
  { code: 'WF', name: 'Wallis-et-Futuna', dialCode: '+681', flag: '🇼🇫' },
  { code: 'TF', name: 'Terres australes françaises', dialCode: '+262', flag: '🇹🇫' },
  { code: 'BL', name: 'Saint-Barthélemy', dialCode: '+590', flag: '🇧🇱' },
  { code: 'MF', name: 'Saint-Martin', dialCode: '+590', flag: '🇲🇫' },
  { code: 'PM', name: 'Saint-Pierre-et-Miquelon', dialCode: '+590', flag: '🇵🇲' },
  { code: 'AW', name: 'Aruba', dialCode: '+297', flag: '🇦🇼' },
  { code: 'CW', name: 'Curaçao', dialCode: '+599', flag: '🇨🇼' },
  { code: 'SX', name: 'Sint Maarten', dialCode: '+1721', flag: '🇸🇽' },
  { code: 'BQ', name: 'Pays-Bas caribéens', dialCode: '+599', flag: '🇧🇶' },
  { code: 'AI', name: 'Anguilla', dialCode: '+1264', flag: '🇦🇮' },
  { code: 'VG', name: 'Îles Vierges britanniques', dialCode: '+1284', flag: '🇻🇬' },
  { code: 'VI', name: 'Îles Vierges américaines', dialCode: '+1340', flag: '🇻🇮' },
  { code: 'MS', name: 'Montserrat', dialCode: '+1664', flag: '🇲🇸' },
  { code: 'TC', name: 'Îles Turques-et-Caïques', dialCode: '+1649', flag: '🇹🇨' },
  { code: 'KY', name: 'Îles Caïmans', dialCode: '+1345', flag: '🇰🇾' },
  { code: 'BM', name: 'Bermudes', dialCode: '+1441', flag: '🇧🇲' },
  { code: 'FK', name: 'Îles Malouines', dialCode: '+500', flag: '🇫🇰' },
  { code: 'GS', name: 'Géorgie du Sud', dialCode: '+500', flag: '🇬🇸' },
  { code: 'IO', name: 'Territoire britannique de l\'océan Indien', dialCode: '+246', flag: '🇮🇴' },
  { code: 'SH', name: 'Sainte-Hélène', dialCode: '+290', flag: '🇸🇭' },
  { code: 'AC', name: 'Île de l\'Ascension', dialCode: '+247', flag: '🇦🇨' },
  { code: 'TA', name: 'Tristan da Cunha', dialCode: '+290', flag: '🇹🇦' },
  { code: 'GQ', name: 'Guinée équatoriale', dialCode: '+240', flag: '🇬🇶' },
  { code: 'GA', name: 'Gabon', dialCode: '+241', flag: '🇬🇦' },
  { code: 'CG', name: 'République du Congo', dialCode: '+242', flag: '🇨🇬' },
  { code: 'CD', name: 'République démocratique du Congo', dialCode: '+243', flag: '🇨🇩' },
  { code: 'CF', name: 'République centrafricaine', dialCode: '+236', flag: '🇨🇫' },
  { code: 'CM', name: 'Cameroun', dialCode: '+237', flag: '🇨🇲' },
  { code: 'TD', name: 'Tchad', dialCode: '+235', flag: '🇹🇩' },
  { code: 'NE', name: 'Niger', dialCode: '+238', flag: '🇳🇪' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬' },
  { code: 'CI', name: 'Côte d\'Ivoire', dialCode: '+225', flag: '🇨🇮' },
  { code: 'GH', name: 'Ghana', dialCode: '+233', flag: '🇬🇭' },
  { code: 'BF', name: 'Burkina Faso', dialCode: '+220', flag: '🇧🇫' },
  { code: 'ML', name: 'Mali', dialCode: '+223', flag: '🇲🇱' },
  { code: 'SN', name: 'Sénégal', dialCode: '+221', flag: '🇸🇳' },
  { code: 'GN', name: 'Guinée', dialCode: '+222', flag: '🇬🇳' },
  { code: 'SL', name: 'Sierra Leone', dialCode: '+232', flag: '🇸🇱' },
  { code: 'LR', name: 'Libéria', dialCode: '+231', flag: '🇱🇷' },
  { code: 'TG', name: 'Togo', dialCode: '+228', flag: '🇹🇬' },
  { code: 'BJ', name: 'Bénin', dialCode: '+229', flag: '🇧🇯' },
  { code: 'CV', name: 'Cap-Vert', dialCode: '+238', flag: '🇨🇻' },
  { code: 'GM', name: 'Gambie', dialCode: '+220', flag: '🇬🇲' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'KZ', name: 'Kazakhstan', dialCode: '+7', flag: '🇰🇿' },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  label?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value, onChange, error = false, helperText, placeholder = "Numéro de téléphone",
  required = false, disabled = false, fullWidth = true, label
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]); // Tunisie par défaut
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const open = Boolean(anchorEl);

  // Obtenir le numéro sans l'indicatif
  const getPhoneNumberWithoutDialCode = (fullNumber: string): string => {
    if (!fullNumber || fullNumber === selectedCountry.dialCode) {
      return '';
    }
    return fullNumber.replace(selectedCountry.dialCode, '').trim();
  };

  // Obtenir le numéro complet avec l'indicatif
  const getFullPhoneNumber = (numberWithoutDialCode: string): string => {
    if (!numberWithoutDialCode) {
      return selectedCountry.dialCode;
    }
    return `${selectedCountry.dialCode}${numberWithoutDialCode}`;
  };

  // Changer de pays
  const handleCountryChange = (country: typeof countries[0]) => {
    setSelectedCountry(country);
    const currentNumber = getPhoneNumberWithoutDialCode(value);
    const newFullNumber = getFullPhoneNumber(currentNumber);
    onChange(newFullNumber);
    setAnchorEl(null);
    setSearchTerm('');
  };

  // Changer le numéro
  const handleNumberChange = (newNumber: string) => {
    const fullNumber = getFullPhoneNumber(newNumber);
    onChange(fullNumber);
  };

  // Filtrer les pays selon la recherche
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.dialCode.includes(searchTerm)
  );

  // Initialiser avec la Tunisie si la valeur est vide
  useEffect(() => {
    if (!value && selectedCountry.dialCode === '+216') {
      onChange('+216');
    }
  }, [value, selectedCountry.dialCode, onChange]);

  // Détecter automatiquement le pays selon la valeur
  useEffect(() => {
    if (value) {
      const country = countries.find(c => value.startsWith(c.dialCode));
      if (country) {
        setSelectedCountry(country);
      }
    }
  }, [value]);

  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto', marginBottom: '8px' }}>
      <TextField
        label={label}
        value={getPhoneNumberWithoutDialCode(value)}
        onChange={(e) => handleNumberChange(e.target.value)}
        error={error}
        helperText={helperText}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        fullWidth={fullWidth}
        InputLabelProps={{
          style: { color: '#000000' }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Box
                sx={{
                  display: 'flex', alignItems: 'center', cursor: 'pointer',
                  borderRight: '1px solid #e2e8f0', pr: 1, mr: 1,
                  borderRadius: 1,
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    backgroundColor: '#e0f2fe', 
                    transform: 'translateY(-1px)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }
                }}
                onClick={(e) => setAnchorEl(e.currentTarget)}
              >
                {/* Drapeau forcé avec style amélioré - FORCÉ */}
                <Box
                  component="span"
                  sx={{
                    mr: 0.5,
                    fontSize: '1.3rem',
                    lineHeight: 1,
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
                    display: 'inline-block',
                    fontFamily: 'inherit'
                  }}
                >
                  {selectedCountry.flag}
                </Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mr: 0.5, 
                    fontWeight: 600, 
                    color: '#000000',
                    fontSize: '0.875rem'
                  }}
                >
                  {selectedCountry.dialCode}
                </Typography>
                <KeyboardArrowDown 
                  sx={{ 
                    fontSize: 16, 
                    color: '#64748b', 
                    transition: 'transform 0.2s ease' 
                  }} 
                />
              </Box>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <Phone sx={{ color: '#64748b', fontSize: 20 }} />
            </InputAdornment>
          )
        }}
        sx={{
          marginBottom: '8px',
          '& .MuiInputLabel-root': {
            color: '#000000 !important'
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#000000 !important'
          },
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            '&:hover .MuiOutlinedInput-notchedOutline': { 
              borderColor: '#10b981 !important',
              borderWidth: '2px !important'
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { 
              borderColor: '#10b981 !important',
              borderWidth: '2px !important'
            }
          }
        }}
      />

      {/* Menu déroulant des pays avec drapeaux forcés */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => { setAnchorEl(null); setSearchTerm(''); }}
        PaperProps={{ 
          sx: { 
            maxHeight: 400, 
            width: 320, 
            mt: 1,
            '& .MuiList-root': {
              padding: 0
            }
          } 
        }}
      >
        {/* Barre de recherche */}
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <TextField
            ref={searchInputRef}
            size="small"
            placeholder="Rechercher un pays..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            autoFocus
            InputProps={{ startAdornment: (<InputAdornment position="start"><Phone sx={{ fontSize: 16, color: '#64748b' }} /></InputAdornment>) }}
          />
        </Box>

        {/* Liste des pays avec drapeaux forcés */}
        <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
          {filteredCountries.map((country) => (
            <MenuItem
              key={country.code}
              onClick={() => handleCountryChange(country)}
              selected={selectedCountry.code === country.code}
              sx={{
                display: 'flex', alignItems: 'center', py: 1.5, px: 2,
                '&:hover': { backgroundColor: 'rgba(16, 185, 129, 0.08)' },
                '&.Mui-selected': { 
                  backgroundColor: 'rgba(16, 185, 129, 0.12)', 
                  '&:hover': { backgroundColor: 'rgba(16, 185, 129, 0.16)' } 
                }
              }}
            >
              {/* Drapeau forcé avec style amélioré - FORCÉ */}
              <Box
                component="span"
                sx={{
                  mr: 1.5,
                  fontSize: '1.4rem',
                  lineHeight: 1,
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
                  minWidth: '1.5rem',
                  textAlign: 'center',
                  display: 'inline-block',
                  fontFamily: 'inherit'
                }}
              >
                {country.flag}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#1e293b' }}>{country.name}</Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>{country.dialCode}</Typography>
              </Box>
            </MenuItem>
          ))}
        </Box>
      </Menu>
    </Box>
  );
};

export default PhoneInput; 