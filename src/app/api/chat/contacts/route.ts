import { NextResponse } from 'next/server';
import { getVerifiedContacts } from '@/lib/secureChatDb';

export async function GET() {
  try {
    const contacts = getVerifiedContacts();
    return NextResponse.json({
      success: true,
      count: contacts.length,
      contacts,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve chat contacts' },
      { status: 500 }
    );
  }
}
