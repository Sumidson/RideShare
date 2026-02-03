import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with admin privileges if needed, 
// or use the standard client if RLS allows public inserts.
// Using standard client here as we enabled public inserts in RLS.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, subject, message } = body;

        // Basic validation
        if (!email || !subject || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Insert into Supabase
        const { error } = await supabase
            .from('contact_messages')
            .insert([
                {
                    email,
                    subject,
                    message,
                    created_at: new Date().toISOString(),
                }
            ]);

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        // Log the successful submission (Simulation of email sending)
        console.log(`New contact message from ${email} regarding ${subject}`);
        console.log(`Forwarding to: classtrinity137@gmail.com`);

        // In a real app, you would use Resend, SendGrid, or similar here:
        // await sendEmail({ to: 'classtrinity137@gmail.com', subject, text: message });

        return NextResponse.json({ success: true, message: 'Message received' });

    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
