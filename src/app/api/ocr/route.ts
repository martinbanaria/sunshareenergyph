import { NextRequest, NextResponse } from 'next/server';
import { extractIDInfoWithValidation } from '@/lib/ocr/ai-ocr';

export async function POST(request: NextRequest) {
  try {
    const { image, useAI = true } = await request.json();

    console.log('🔍 OCR API Request:', {
      hasImage: !!image,
      imageLength: image?.length || 0,
      imagePrefix: image?.substring(0, 30) || 'No image',
      useAI
    });

    if (!image) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    // Validate image format
    if (!image.startsWith('data:image/')) {
      console.error('❌ Invalid image format:', image.substring(0, 50));
      return NextResponse.json(
        { error: 'Invalid image format. Please provide a base64 encoded image.' },
        { status: 400 }
      );
    }

    // Check API key availability
    if (useAI && !process.env.OPENAI_API_KEY) {
      console.error('❌ OpenAI API key not configured');
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
        console.log('🤖 Starting AI OCR extraction...');
        const startTime = Date.now();
        
        const result = await extractIDInfoWithValidation(image);
        
        const processingTime = Date.now() - startTime;
        console.log(`⏱️ AI OCR completed in ${processingTime}ms`);
        
        console.log('🎯 AI OCR Result Summary:', {
          name: result.name ? `Found: "${result.name.substring(0, 20)}..."` : 'Missing',
          address: result.address ? `Found: "${result.address.substring(0, 30)}..."` : 'Missing',
          idNumber: result.idNumber ? `Found: "${result.idNumber}"` : 'Missing',
          idType: result.idType || 'Unknown',
          confidence: result.confidence || 0
        });
        
        return NextResponse.json({
          success: true,
          method: 'ai',
          processingTime,
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
        console.error('💥 AI OCR failed:', aiError);
        console.error('Stack trace:', aiError instanceof Error ? aiError.stack : 'No stack');
        
        return NextResponse.json({
          success: false,
          method: 'ai',
          error: aiError instanceof Error ? aiError.message : 'AI OCR failed',
          errorType: aiError instanceof Error ? aiError.constructor.name : 'Unknown',
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