import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const event = await request.json();

    // Validate required fields
    if (!event.action || typeof event.step !== 'number') {
      return NextResponse.json(
        { error: 'Invalid event data' },
        { status: 400 }
      );
    }

    // In development, just log the event
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event Received:', {
        action: event.action,
        step: event.step,
        timestamp: event.timestamp,
        data: event.data,
      });

      return NextResponse.json({ success: true });
    }

    // In production, store in Supabase (optional)
    // Uncomment this section if you want to store analytics in your database
    /*
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        session_id: event.sessionId,
        action: event.action,
        step: event.step,
        user_id: event.userId || null,
        event_data: event.data || {},
        user_agent: event.userAgent,
        viewport: event.viewport,
        timestamp: event.timestamp,
      });

    if (error) {
      console.error('Analytics storage error:', error);
      // Don't fail the request for analytics errors
    }
    */

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics API error:', error);
    
    // Don't fail for analytics - return success to prevent blocking user flow
    return NextResponse.json({ success: true });
  }
}