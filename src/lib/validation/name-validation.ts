// Name validation service for cross-step validation in onboarding
// Handles Philippine naming conventions and name matching

export interface StructuredName {
  firstName: string;
  middleName?: string;
  lastName: string;
  nickname?: string;
}

export interface NameValidationResult {
  matches: boolean;
  confidence: 'high' | 'medium' | 'low';
  score: number; // 0-100
  details: {
    firstNameMatch: boolean;
    lastNameMatch: boolean;
    middleNameMatch?: boolean;
    extractedFormat: string;
    userFormat: string;
    suggestions?: string[];
    warnings?: string[];
  };
}

// Common Philippine name patterns and variations
const FILIPINO_NAME_PATTERNS = {
  // Common prefixes/suffixes
  prefixes: ['de', 'del', 'dela', 'delos', 'delas', 'san', 'santa'],
  suffixes: ['jr', 'sr', 'iii', 'iv', '2nd', '3rd', '4th'],
  
  // Common nickname mappings
  nicknames: {
    'jose': ['jo', 'joey', 'joe', 'pepito', 'pepe'],
    'maria': ['mary', 'marie', 'ria'],
    'juan': ['john', 'johnny'],
    'antonio': ['tony', 'anton'],
    'francisco': ['frank', 'frankie', 'cisco'],
    'leonardo': ['leo', 'leon'],
    'ricardo': ['rick', 'ricky'],
    'roberto': ['bob', 'bobby', 'bert'],
    'carlos': ['carl'],
    'miguel': ['mike', 'mikey'],
    'rafael': ['ralph', 'rafa'],
    'manuel': ['manny', 'manolo'],
    'gabriel': ['gab', 'gabby'],
    'alejandro': ['alex'],
    'fernando': ['fernando', 'nando'],
    'patricia': ['pat', 'patty'],
    'elizabeth': ['liz', 'beth', 'betty'],
    'catherine': ['cathy', 'cat', 'kate'],
    'margaret': ['maggie', 'meg'],
    'stephanie': ['steph'],
  }
};

/**
 * Normalizes a name string for comparison
 * Handles common variations, spacing, and case differences
 */
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ') // Normalize whitespace
    .split(' ')
    .filter(part => part.length > 0)
    .join(' ');
}

/**
 * Parses extracted name from ID (typically in "LASTNAME, FIRSTNAME MIDDLENAME" format)
 */
export function parseExtractedName(extractedName: string): StructuredName | null {
  if (!extractedName || extractedName.trim().length === 0) {
    return null;
  }

  const normalized = extractedName.trim();
  
  // Handle "LASTNAME, FIRSTNAME MIDDLENAME" format (common in Philippine IDs)
  if (normalized.includes(',')) {
    const parts = normalized.split(',').map(part => part.trim());
    if (parts.length >= 2) {
      const lastName = parts[0];
      const firstAndMiddle = parts[1].split(/\s+/);
      const firstName = firstAndMiddle[0] || '';
      const middleName = firstAndMiddle.slice(1).join(' ') || undefined;
      
      return {
        firstName: firstName.toLowerCase(),
        middleName: middleName?.toLowerCase(),
        lastName: lastName.toLowerCase(),
      };
    }
  }
  
  // Handle "FIRSTNAME MIDDLENAME LASTNAME" format
  const nameParts = normalized.split(/\s+/).filter(part => part.length > 0);
  if (nameParts.length >= 2) {
    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1];
    const middleName = nameParts.slice(1, -1).join(' ') || undefined;
    
    return {
      firstName: firstName.toLowerCase(),
      middleName: middleName?.toLowerCase(),
      lastName: lastName.toLowerCase(),
    };
  }
  
  return null;
}

/**
 * Combines user input into a structured name
 */
export function combineUserName(userData: StructuredName): StructuredName {
  return {
    firstName: normalizeName(userData.firstName),
    middleName: userData.middleName ? normalizeName(userData.middleName) : undefined,
    lastName: normalizeName(userData.lastName),
    nickname: userData.nickname ? normalizeName(userData.nickname) : undefined,
  };
}

/**
 * Calculates similarity score between two name strings
 */
function calculateNameSimilarity(name1: string, name2: string): number {
  if (!name1 || !name2) return 0;
  
  const norm1 = normalizeName(name1);
  const norm2 = normalizeName(name2);
  
  // Exact match
  if (norm1 === norm2) return 100;
  
  // Check if one is contained in the other
  if (norm1.includes(norm2) || norm2.includes(norm1)) return 80;
  
  // Check nickname mappings
  for (const [formal, nicknames] of Object.entries(FILIPINO_NAME_PATTERNS.nicknames)) {
    if ((norm1 === formal && nicknames.includes(norm2)) ||
        (norm2 === formal && nicknames.includes(norm1)) ||
        (nicknames.includes(norm1) && nicknames.includes(norm2))) {
      return 90;
    }
  }
  
  // Basic string similarity (Levenshtein-like)
  const maxLength = Math.max(norm1.length, norm2.length);
  if (maxLength === 0) return 0;
  
  let matches = 0;
  const minLength = Math.min(norm1.length, norm2.length);
  
  for (let i = 0; i < minLength; i++) {
    if (norm1[i] === norm2[i]) matches++;
  }
  
  return Math.floor((matches / maxLength) * 100);
}

/**
 * Validates if user-provided name matches extracted name from ID
 */
export function validateNameMatch(
  userData: StructuredName,
  extractedName: string
): NameValidationResult {
  const userCombined = combineUserName(userData);
  const extractedParsed = parseExtractedName(extractedName);
  
  if (!extractedParsed) {
    return {
      matches: false,
      confidence: 'low',
      score: 0,
      details: {
        firstNameMatch: false,
        lastNameMatch: false,
        extractedFormat: extractedName,
        userFormat: `${userCombined.firstName} ${userCombined.lastName}`,
        warnings: ['Could not parse extracted name from ID'],
      },
    };
  }
  
  // Calculate individual component matches
  const firstNameScore = calculateNameSimilarity(userCombined.firstName, extractedParsed.firstName);
  const lastNameScore = calculateNameSimilarity(userCombined.lastName, extractedParsed.lastName);
  
  let middleNameScore = 100; // Default to 100 if no middle name to compare
  if (userCombined.middleName && extractedParsed.middleName) {
    middleNameScore = calculateNameSimilarity(userCombined.middleName, extractedParsed.middleName);
  } else if (userCombined.middleName || extractedParsed.middleName) {
    // One has middle name, other doesn't - still acceptable
    middleNameScore = 70;
  }
  
  const firstNameMatch = firstNameScore >= 70;
  const lastNameMatch = lastNameScore >= 70;
  const middleNameMatch = middleNameScore >= 70;
  
  // Calculate overall score
  const overallScore = Math.floor((firstNameScore + lastNameScore + middleNameScore) / 3);
  
  // Determine confidence and match status
  let matches = false;
  let confidence: 'high' | 'medium' | 'low' = 'low';
  
  if (firstNameMatch && lastNameMatch && middleNameMatch) {
    matches = true;
    confidence = overallScore >= 90 ? 'high' : 'medium';
  } else if (firstNameMatch && lastNameMatch) {
    matches = true;
    confidence = overallScore >= 85 ? 'medium' : 'low';
  } else if ((firstNameMatch || lastNameMatch) && overallScore >= 60) {
    // Partial match might be acceptable in some cases
    matches = true;
    confidence = 'low';
  }
  
  // Generate suggestions and warnings
  const suggestions: string[] = [];
  const warnings: string[] = [];
  
  if (!firstNameMatch && firstNameScore < 50) {
    warnings.push(`First name mismatch: "${userCombined.firstName}" vs "${extractedParsed.firstName}"`);
    suggestions.push(`Consider updating first name to "${extractedParsed.firstName}"`);
  }
  
  if (!lastNameMatch && lastNameScore < 50) {
    warnings.push(`Last name mismatch: "${userCombined.lastName}" vs "${extractedParsed.lastName}"`);
    suggestions.push(`Consider updating last name to "${extractedParsed.lastName}"`);
  }
  
  if (!middleNameMatch && middleNameScore < 50) {
    warnings.push(`Middle name mismatch`);
    if (extractedParsed.middleName) {
      suggestions.push(`Consider adding middle name: "${extractedParsed.middleName}"`);
    }
  }
  
  if (!matches) {
    warnings.push('Names do not match sufficiently. Please ensure you are using your legal name as it appears on your ID.');
  }
  
  return {
    matches,
    confidence,
    score: overallScore,
    details: {
      firstNameMatch,
      lastNameMatch,
      middleNameMatch,
      extractedFormat: extractedName,
      userFormat: [
        userCombined.firstName,
        userCombined.middleName,
        userCombined.lastName
      ].filter(Boolean).join(' '),
      suggestions: suggestions.length > 0 ? suggestions : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
    },
  };
}

/**
 * Gets user's full legal name for database storage and auth
 */
export function getFullLegalName(userData: StructuredName): string {
  const parts = [userData.firstName, userData.middleName, userData.lastName]
    .filter(Boolean)
    .map(part => part?.trim())
    .filter(part => part && part.length > 0);
  
  return parts.join(' ');
}

/**
 * Gets user's display name (uses nickname if available, otherwise first name)
 */
export function getDisplayName(userData: StructuredName): string {
  if (userData.nickname && userData.nickname.trim().length > 0) {
    return userData.nickname.trim();
  }
  return userData.firstName.trim();
}