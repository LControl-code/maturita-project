import { NextResponse } from 'next/server'
import { getLimitsForMotorType } from '@/lib/pocketbase_connect';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let motorTypeInput = searchParams.get('motorType');

  let motorTypes: ('EFAD' | 'ERAD' | 'Short')[];

  if (motorTypeInput) {
    // Correct typos to match 'EFAD', 'ERAD', or 'Short'
    const validMotorTypes = ['EFAD', 'ERAD', 'Short'];
    const motorType = correctMotorType(motorTypeInput, validMotorTypes);

    if (!motorType) {
      return NextResponse.json({ error: 'Invalid motorType parameter' });
    }

    motorTypes = [motorType];
  } else {
    // No motorType provided, fetch all motor types
    motorTypes = ['EFAD', 'ERAD', 'Short'];
  }

  try {
    const dataPromises = motorTypes.map(mt => getLimitsForMotorType(mt));
    const dataArray = await Promise.all(dataPromises);
    const data = dataArray.flat();
    return NextResponse.json(data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to fetch S02 limits', message: error.message });
    } else {
      return NextResponse.json({ error: 'Failed to fetch S02 limits', message: 'Unknown error' });
    }
  }
}

function correctMotorType(input: string, validOptions: string[]): 'EFAD' | 'ERAD' | 'Short' | undefined {
  input = input.trim().toLowerCase();
  for (const option of validOptions) {
    if (option.toLowerCase() === input) {
      return option as 'EFAD' | 'ERAD' | 'Short';
    }
  }

  // Simple typo correction logic
  for (const option of validOptions) {
    if (isSimilar(input, option.toLowerCase())) {
      return option as 'EFAD' | 'ERAD' | 'Short';
    }
  }

  return undefined;
}

function isSimilar(a: string, b: string): boolean {
  // Check if strings differ by at most one character
  if (Math.abs(a.length - b.length) > 1) return false;
  let differences = 0;
  let i = 0, j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] !== b[j]) {
      differences++;
      if (differences > 1) return false;
      if (a.length > b.length) i++;
      else if (a.length < b.length) j++;
      else {
        i++;
        j++;
      }
    } else {
      i++;
      j++;
    }
  }
  differences += a.length - i + b.length - j;
  return differences <= 1;
}