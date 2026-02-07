// AI OCR implementation using GPT-4 Vision for Philippine ID extraction
import OpenAI from 'openai';

export interface AIExtractedData {
  name: string;
  address: string;
  idNumber: string;
  idType: string;
  birthDate: string;
  confidence: number;
  explanation: string;
  validation: {
    hasValidName: boolean;
    hasValidAddress: boolean;
    hasValidIdNumber: boolean;
    patterns: string[];
    warnings: string[];
  };
}

// Philippine ID patterns for validation
const PHILIPPINE_ID_PATTERNS = {
  philid: /^\d{4}-\d{4}-\d{4}-\d{4}$/,        // 1234-5678-9012-3456
  license: /^[A-Z]\d{2}-\d{2}-\d{6}$/,        // A12-34-567890
  passport: /^[A-Z]{2}\d{7}$/,                // AB1234567
  tin: /^\d{3}-\d{3}-\d{3}(-\d{3})?$/,        // 123-456-789 or 123-456-789-000
  sss: /^\d{2}-\d{7}-\d$/,                    // 12-1234567-8
  voters: /^\d{4}-\d{4}-\d{4}$/,              // 1234-5678-9012
  senior: /^\d{2}-\d{7}-\d{2}$/,              // 12-1234567-89
  pwd: /^PWD-\d{2}-\d{6}$/,                   // PWD-12-123456
  postal: /^\d{4}$/,                          // 1234 (Postal ID)
  philhealth: /^\d{2}-\d{9}-\d$/,             // 12-123456789-0
  generic_numeric: /^\d{8,}$/,                // Any 8+ digit number
  generic_dashed: /^\d{2,4}-\d{4,}-\d{1,4}$/ // Generic dashed pattern
};

// Lazy initialization of OpenAI client to avoid runtime errors
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('Missing credentials. Please pass an `apiKey`, or set the `OPENAI_API_KEY` environment variable.');
    }
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

function getExtractionPrompt(): string {
  return `
You are an expert OCR system specialized in reading Philippine government identification documents.

Analyze this image carefully and extract the following information:
1. Full Name (exactly as written)
2. Address (complete address if visible)
3. ID Number (CRITICAL: Find the unique identification number)
4. ID Type (PhilID/National ID, Driver's License, Passport, TIN, SSS, etc.)
5. Birth Date (if visible)

CRITICAL ID NUMBER EXTRACTION GUIDELINES:
- PhilID/National ID: Look for "PSN" or "PCN" followed by XXXX-XXXX-XXXX-XXXX (16 digits with dashes)
- Driver's License: Format AXX-XX-XXXXXX (e.g., A12-34-567890) - usually near "LICENSE NO" or "LIC NO"
- Passport: Format ABXXXXXXX (e.g., AB1234567) - usually near "PASSPORT NO"
- TIN ID: Format XXX-XXX-XXX-XXX - usually near "TIN"
- SSS ID: Format XX-XXXXXXX-X - usually near "SSS NO"
- Voter's ID: Various formats - look for "PRECINCT NO" area
- Senior Citizen ID: Usually has "ID NO" followed by numbers
- PWD ID: Usually has "ID NO" or "CONTROL NO"

SEARCH STRATEGY FOR ID NUMBERS:
1. Look for labels like: "ID NO", "LICENSE NO", "PASSPORT NO", "PSN", "PCN", "TIN", "SSS NO", "CONTROL NO"
2. Look for numeric patterns with dashes or without
3. Check corners, headers, and footer areas of the ID
4. Look for barcodes or QR codes nearby which often have ID numbers
5. Check both front and back if visible
6. ID numbers are usually in a distinct font or highlighted area

EXTRACTION RULES:
- Extract text EXACTLY as it appears, including proper capitalization
- For names: Include full name with proper spacing and commas
- For addresses: Include complete address with proper formatting
- For ID numbers: Include dashes and formatting as shown
- If multiple number sequences found, choose the most prominent/official one

Return your response in this exact JSON format:
{
  "name": "extracted full name",
  "address": "extracted address",
  "idNumber": "extracted ID number with exact formatting",
  "idType": "document type identified",
  "birthDate": "extracted birth date if visible",
  "confidence": confidence_score_0_to_100,
  "explanation": "brief explanation of what you found and where you found the ID number"
}
`;
}

// Focused ID number extraction for when initial OCR misses it
async function attemptFocusedIDExtraction(imageBase64: string): Promise<string | null> {
  try {
    const focusedPrompt = `
Look at this Philippine ID image and ONLY focus on finding the ID number. Ignore all other text.

Search these specific areas and labels:
- "PSN" or "PCN" followed by numbers (for PhilID/National ID)
- "LICENSE NO" or "LIC NO" followed by numbers (for Driver's License)  
- "PASSPORT NO" followed by numbers (for Passport)
- "TIN" followed by numbers (for TIN ID)
- "SSS NO" followed by numbers (for SSS ID)
- "ID NO" or "ID NUMBER" followed by numbers
- "CONTROL NO" followed by numbers
- Any prominent numeric sequence with dashes or formatting

Return ONLY the ID number you find, with exact formatting. If you find multiple candidates, return the most prominent one.
If no ID number is found, return "NONE".

Example responses:
- "1234-5678-9012-3456"
- "A12-34-567890" 
- "AB1234567"
- "NONE"
    `;

    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: focusedPrompt },
            {
              type: "image_url",
              image_url: {
                url: imageBase64,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 100,
    });

    const result = response.choices[0]?.message?.content?.trim();
    if (result && result !== 'NONE' && result.length > 5) {
      console.log('Focused ID extraction found:', result);
      return result;
    }
    
    return null;
  } catch (error) {
    console.error('Focused ID extraction failed:', error);
    return null;
  }
}

export async function extractIDInfoWithAI(
  imageBase64: string,
  progressCallback?: (progress: number, status: string) => void
): Promise<AIExtractedData> {
  try {
    console.log('🔑 OpenAI API Key check:', process.env.OPENAI_API_KEY ? 'Present' : 'Missing');
    
    progressCallback?.(10, 'Connecting to AI OCR service...');
    
    const openai = getOpenAIClient();
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: getExtractionPrompt() },
            {
              type: "image_url",
              image_url: {
                url: imageBase64,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 1500, // Increased for more detailed responses
    });

    progressCallback?.(60, 'Processing AI response...');
    
    const content = response.choices[0]?.message?.content;
    console.log('🤖 Raw OpenAI Response:', content);
    
    if (!content) {
      throw new Error('No response from AI service');
    }

    console.log('📝 Content to parse:', content.substring(0, 200) + '...');
    
    // Parse the JSON response
    let extractedData;
    try {
      // Try to clean the content in case there's extra text around the JSON
      let jsonContent = content.trim();
      
      // If the content has markdown code blocks, extract just the JSON
      if (jsonContent.includes('```json')) {
        const jsonStart = jsonContent.indexOf('```json') + 7;
        const jsonEnd = jsonContent.indexOf('```', jsonStart);
        if (jsonEnd > jsonStart) {
          jsonContent = jsonContent.substring(jsonStart, jsonEnd).trim();
        }
      } else if (jsonContent.includes('```')) {
        const jsonStart = jsonContent.indexOf('```') + 3;
        const jsonEnd = jsonContent.lastIndexOf('```');
        if (jsonEnd > jsonStart) {
          jsonContent = jsonContent.substring(jsonStart, jsonEnd).trim();
        }
      }
      
      console.log('🧹 Cleaned JSON content:', jsonContent);
      extractedData = JSON.parse(jsonContent);
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError);
      console.error('📄 Raw content that failed to parse:', content);
      throw new Error(`Failed to parse AI response as JSON: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`);
    }
    
    progressCallback?.(80, 'Validating extracted data...');
    
    console.log('✅ Parsed extracted data:', extractedData);
    
    // If ID number is missing or seems incomplete, try a second focused extraction
    if (!extractedData.idNumber || extractedData.idNumber.length < 5) {
      console.log('🔍 ID number missing or incomplete, attempting focused extraction...');
      progressCallback?.(85, 'Searching for ID number...');
      
      const focusedExtraction = await attemptFocusedIDExtraction(imageBase64);
      if (focusedExtraction) {
        extractedData.idNumber = focusedExtraction;
        extractedData.explanation = (extractedData.explanation || '') + ' (ID number found via focused search)';
      }
    }
    
    // Log final extracted data for debugging
    console.log('🏁 Final Extracted Data:', extractedData);
    
    // Validate and enhance the extracted data
    const validation = validateExtractedData(extractedData);
    
    progressCallback?.(100, 'OCR complete');
    
    return {
      name: extractedData.name || '',
      address: extractedData.address || '',
      idNumber: extractedData.idNumber || '',
      idType: extractedData.idType || 'unknown',
      birthDate: extractedData.birthDate || '',
      confidence: Math.min(Math.max(extractedData.confidence || 0, 0), 100),
      explanation: extractedData.explanation || 'AI OCR completed',
      validation
    };
    
  } catch (error) {
    console.error('💥 AI OCR Error:', error);
    console.error('🔍 Error details:', error instanceof Error ? error.stack : 'No stack trace');
    throw new Error(`AI OCR failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function validateExtractedData(data: any) {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  // Validate name
  if (!data.name || data.name.length < 3) {
    issues.push('Name not found or too short');
    suggestions.push('Ensure the name area is clearly visible');
  }
  
  if (data.name && !/[a-zA-Z]/.test(data.name)) {
    issues.push('Name appears to contain no letters');
    suggestions.push('Check if the name field was correctly identified');
  }

  // Enhanced ID number validation
  if (!data.idNumber || data.idNumber.length < 3) {
    issues.push('ID number not found');
    suggestions.push('Ensure the ID number area is clearly visible and not obscured');
  } else {
    // Check if ID number matches any known Philippine patterns
    const idType = data.idType ? data.idType.toLowerCase() : '';
    let patternMatched = false;
    
    // Check specific patterns based on ID type
    if (idType.includes('philid') || idType.includes('national')) {
      if (PHILIPPINE_ID_PATTERNS.philid.test(data.idNumber)) {
        patternMatched = true;
      }
    } else if (idType.includes('license') || idType.includes('driver')) {
      if (PHILIPPINE_ID_PATTERNS.license.test(data.idNumber)) {
        patternMatched = true;
      }
    } else if (idType.includes('passport')) {
      if (PHILIPPINE_ID_PATTERNS.passport.test(data.idNumber)) {
        patternMatched = true;
      }
    } else if (idType.includes('tin')) {
      if (PHILIPPINE_ID_PATTERNS.tin.test(data.idNumber)) {
        patternMatched = true;
      }
    } else if (idType.includes('sss')) {
      if (PHILIPPINE_ID_PATTERNS.sss.test(data.idNumber)) {
        patternMatched = true;
      }
    }
    
    // If specific pattern didn't match, try generic patterns
    if (!patternMatched) {
      for (const [patternName, pattern] of Object.entries(PHILIPPINE_ID_PATTERNS)) {
        if (pattern.test(data.idNumber)) {
          patternMatched = true;
          break;
        }
      }
    }
    
    if (!patternMatched && data.idNumber.length > 5) {
      // Accept if it looks like an ID number (has some structure)
      if (/[\d-]{6,}/.test(data.idNumber)) {
        patternMatched = true;
      }
    }
    
    if (!patternMatched) {
      issues.push('ID number format may be incorrect for the identified document type');
      suggestions.push('Verify the ID number is complete and correctly formatted');
    }
  }

  // Check confidence level
  if (data.confidence < 40) {
    issues.push('Low confidence in extracted data');
    suggestions.push('Consider retaking the photo with better lighting or different angle');
  }

  return {
    isValid: issues.length === 0,
    hasValidName: !!(data.name && data.name.length > 2),
    hasValidAddress: !!(data.address && data.address.length > 5),
    hasValidIdNumber: !!(data.idNumber && data.idNumber.length > 3),
    patterns: Object.keys(PHILIPPINE_ID_PATTERNS),
    issues,
    warnings: issues.length > 0 ? issues : []
  };
}

export async function extractIDInfoWithValidation(
  imageBase64: string,
  progressCallback?: (progress: number, status: string) => void
): Promise<AIExtractedData & { validation: ReturnType<typeof validateExtractedData> }> {
  const extractedData = await extractIDInfoWithAI(imageBase64, progressCallback);
  const validation = validateExtractedData(extractedData);
  
  return {
    ...extractedData,
    validation
  };
}

// Validate if the selected ID type matches the detected ID type from OCR
export function validateIDTypeMatch(selectedType: string, detectedType: string): {
  matches: boolean;
  confidence: 'high' | 'medium' | 'low';
  detectedType: string;
  suggestion?: string;
  suggestedValue?: string; // Added: The actual ID type value to use
} {
  // Normalize both strings for comparison
  const normalizeType = (type: string) => type.toLowerCase().replace(/[^a-z]/g, '');
  const selectedNorm = normalizeType(selectedType);
  const detectedNorm = normalizeType(detectedType);
  
  // Direct match keywords for different ID types
  const idTypeKeywords = {
    'philid': ['philid', 'nationalid', 'national', 'phil', 'psn', 'pcn'],
    'drivers-license': ['license', 'driver', 'driving', 'dl'],
    'passport': ['passport', 'pp'],
    'tin': ['tin', 'taxpayer', 'tax'],
    'sss': ['sss', 'social'],
    'voters-id': ['voters', 'voter', 'voting', 'comelec'],
    'senior-citizen': ['senior', 'citizen', 'elderly'],
    'pwd': ['pwd', 'disability', 'disabled'],
    'postal': ['postal', 'post'],
    'philhealth': ['philhealth', 'health', 'phil'],
    'umid': ['umid', 'unified'],
    'prc': ['prc', 'professional', 'regulation'],
    'firearm': ['firearm', 'gun', 'ltopf'],
    'barangay': ['barangay', 'brgy'],
  };
  
  // Find which category the selected type belongs to
  let selectedCategory = '';
  for (const [category, keywords] of Object.entries(idTypeKeywords)) {
    if (keywords.some(keyword => selectedNorm.includes(keyword))) {
      selectedCategory = category;
      break;
    }
  }
  
  // Find which category the detected type belongs to
  let detectedCategory = '';
  for (const [category, keywords] of Object.entries(idTypeKeywords)) {
    if (keywords.some(keyword => detectedNorm.includes(keyword))) {
      detectedCategory = category;
      break;
    }
  }
  
  // Check for direct match
  if (selectedCategory === detectedCategory && selectedCategory !== '') {
    return {
      matches: true,
      confidence: 'high',
      detectedType: detectedType,
    };
  }
  
  // Check for partial matches
  const selectedWords = selectedNorm.split(/\s+/);
  const detectedWords = detectedNorm.split(/\s+/);
  const commonWords = selectedWords.filter(word => detectedWords.includes(word));
  
  if (commonWords.length > 0) {
    return {
      matches: true,
      confidence: 'medium',
      detectedType: detectedType,
    };
  }
  
  // Check for related types (e.g., National ID vs PhilID)
  const relatedTypes = [
    ['philid', 'nationalid', 'national'],
    ['license', 'driver', 'driving'],
    ['senior', 'citizen'],
  ];
  
  for (const relatedGroup of relatedTypes) {
    const selectedInGroup = relatedGroup.some(type => selectedNorm.includes(type));
    const detectedInGroup = relatedGroup.some(type => detectedNorm.includes(type));
    
    if (selectedInGroup && detectedInGroup) {
      return {
        matches: true,
        confidence: 'medium',
        detectedType: detectedType,
      };
    }
  }
  
  // No match found
  let suggestion = '';
  let suggestedValue = '';
  if (detectedCategory) {
    // Convert detected category back to readable format
    const categoryToLabel: Record<string, string> = {
      'philid': 'National ID/PhilID',
      'drivers-license': "Driver's License", 
      'passport': 'Passport',
      'tin': 'TIN ID',
      'sss': 'SSS ID',
      'voters-id': "Voter's ID",
      'senior-citizen': 'Senior Citizen ID',
      'pwd': 'PWD ID',
      'postal': 'Postal ID',
      'philhealth': 'PhilHealth ID',
      'umid': 'UMID',
      'prc': 'PRC ID',
      'firearm': 'Firearm License',
      'barangay': 'Barangay ID',
    };

    // Map detected category to actual ID type values from ID_TYPES
    const categoryToValue: Record<string, string> = {
      'philid': 'philid',
      'drivers-license': 'drivers_license',
      'passport': 'passport', 
      'sss': 'sss',
      'umid': 'umid',
      'postal': 'postal',
      'prc': 'prc',
    };
    
    suggestion = `The document appears to be a ${categoryToLabel[detectedCategory] || detectedType}. Would you like to update your selection?`;
    suggestedValue = categoryToValue[detectedCategory] || '';
  }
  
  return {
    matches: false,
    confidence: 'low',
    detectedType: detectedType,
    suggestion,
    suggestedValue,
  };
}