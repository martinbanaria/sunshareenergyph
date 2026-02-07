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
  tin: /^\d{3}-\d{3}-\d{3}$/,                 // 123-456-789
  sss: /^\d{2}-\d{7}-\d$/                     // 12-1234567-8
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const EXTRACTION_PROMPT = `
You are an expert OCR system specialized in reading Philippine government identification documents.

Analyze this image and extract the following information:
1. Full Name (exactly as written)
2. Address (complete address if visible)
3. ID Number (in the format specific to the document type)
4. ID Type (PhilID/National ID, Driver's License, Passport, TIN, SSS, etc.)
5. Birth Date (if visible)

Important guidelines:
- For PhilID: Look for PSN (Philippine Statistical Number) in format XXXX-XXXX-XXXX-XXXX
- For Driver's License: Format AXX-XX-XXXXXX (e.g., A12-34-567890)
- For Passport: Format ABXXXXXXX (e.g., AB1234567)
- Extract text EXACTLY as it appears, including proper capitalization
- For names: Include full name with proper spacing
- For addresses: Include complete address with proper formatting

Return your response in this exact JSON format:
{
  "name": "extracted full name",
  "address": "extracted address",
  "idNumber": "extracted ID number",
  "idType": "document type identified",
  "birthDate": "extracted birth date if visible",
  "confidence": confidence_score_0_to_100,
  "explanation": "brief explanation of what you found and extraction process"
}
`;

export async function extractIDInfoWithAI(
  imageBase64: string,
  progressCallback?: (progress: number, status: string) => void
): Promise<AIExtractedData> {
  try {
    progressCallback?.(10, 'Connecting to AI OCR service...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: EXTRACTION_PROMPT },
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
      max_tokens: 1000,
    });

    progressCallback?.(80, 'Processing AI response...');
    
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI service');
    }

    // Parse the JSON response
    const extractedData = JSON.parse(content);
    
    progressCallback?.(95, 'Validating extracted data...');
    
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
    console.error('AI OCR Error:', error);
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

  // Check ID number format based on ID type
  if (data.idNumber) {
    const idType = data.idType.toLowerCase();
    if (idType.includes('philid') || idType.includes('national')) {
      if (!/^\d{4}-\d{4}-\d{4}-\d{4}$/.test(data.idNumber)) {
        issues.push('PhilID number format appears incorrect (expected: XXXX-XXXX-XXXX-XXXX)');
      }
    } else if (idType.includes('license') || idType.includes('driver')) {
      if (!/^[A-Z]\d{2}-\d{2}-\d{6}$/.test(data.idNumber)) {
        issues.push('Driver\'s License number format may be incorrect (expected: A12-34-567890)');
      }
    }
  }

  // Check confidence level
  if (data.confidence < 50) {
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