import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { openai } from '@/lib/openai';
import { generateAutofillPrompt } from '@/lib/prompts';
import type { ChatMessage, PlanData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId } = await request.json();

    // Get chat history
    const { data: messages, error: messagesError } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });

    if (messagesError || !messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'No messages found' },
        { status: 400 }
      );
    }

    // Format messages for prompt
    const formattedMessages = (messages as ChatMessage[])
      .map((m) => `${m.sender === 'user' ? 'ユーザー' : 'AI'}: ${m.content}`)
      .join('\n\n');

    // Generate autofill data
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: generateAutofillPrompt(formattedMessages),
        },
      ],
      temperature: 0.3,
      max_tokens: 1500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: 'Failed to generate data' },
        { status: 500 }
      );
    }

    // Parse JSON response
    let planData: PlanData;
    try {
      // Extract JSON from the response (handle potential markdown code blocks)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      planData = JSON.parse(jsonMatch[0]);
    } catch {
      console.error('Failed to parse autofill response:', content);
      return NextResponse.json(
        { error: 'Failed to parse response' },
        { status: 500 }
      );
    }

    // Update project with plan data
    const { error: updateError } = await supabase
      .from('projects')
      .update({
        plan_data: planData,
        title: planData.serviceName || 'New Project',
      })
      .eq('id', projectId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ planData });
  } catch (error) {
    console.error('Autofill API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
