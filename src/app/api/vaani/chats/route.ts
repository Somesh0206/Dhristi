import { NextResponse } from 'next/server';
import { getVaaniChats, saveVaaniChat, clearVaaniChats } from '@/lib/vaaniDb';

export async function GET() {
  try {
    const chats = getVaaniChats();
    return NextResponse.json({
      success: true,
      count: chats.length,
      database: 'vaani_chats.json',
      chats,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve VAANI chats' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.text || !body.sender) {
      return NextResponse.json(
        { success: false, error: 'Missing text or sender' },
        { status: 400 }
      );
    }

    const saved = saveVaaniChat({
      sender: body.sender,
      text: body.text,
      time: body.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: body.language || 'en',
      actionRoute: body.actionRoute,
      actionModal: body.actionModal,
    });

    return NextResponse.json({
      success: true,
      message: 'Chat saved to database',
      chat: saved,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to save VAANI chat' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    clearVaaniChats();
    return NextResponse.json({
      success: true,
      message: 'VAANI chat history cleared from database',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to clear chat history' },
      { status: 500 }
    );
  }
}
