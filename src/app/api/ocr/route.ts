import { NextRequest, NextResponse } from 'next/server';
import { extractIDInfoWithValidation } from '@/lib/ocr/ai-ocr';

export async function POST(request: NextRequest) {
  try {
    const { image, useAI = true } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    // Validate image format
    if (!image.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Invalid image format. Please provide a base64 encoded image.' },
        { status: 400 }
      );
    }

    // Check API key availability
    if (useAI && !process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { 
          error: 'OpenAI API key not configured',
          fallback: true,
          message: 'AI OCR not available. Please configure OPENAI_API_KEY environment variable.'
        },
        { status: 503 }
      );
    }

    if (useAI) {
      // Use AI OCR
      try {
        const result = await extractIDInfoWithValidation(image);
        
        return NextResponse.json({
          success: true,
          method: 'ai',
          data: {
            name: result.name,
            address: result.address,
            idNumber: result.idNumber,
            idType: result.idType,
            birthDate: result.birthDate,
            confidence: result.confidence,
            explanation: result.explanation,
            validation: result.validation
          }
        });
        
      } catch (aiError) {
        console.error('AI OCR failed:', aiError);
        
        return NextResponse.json({
          success: false,
          method: 'ai',
          error: aiError instanceof Error ? aiError.message : 'AI OCR failed',
          fallbackAvailable: true
        }, { status: 500 });
      }
    } else {
      // Traditional OCR not implemented - suggest AI OCR
      return NextResponse.json({
        success: false,
        method: 'traditional',
        error: 'Traditional OCR not available. Please use AI OCR.',
        suggestion: 'Switch to AI OCR for better accuracy and reliability'
      }, { status: 501 });
    }

  } catch (error) {
    console.error('OCR API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}