// File: app/api/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const apiInfo = {
    message: "Welcome to the API",
    endpoints: [
      {
        path: "/api/devices",
        description: "Get a list of devices or perform device-related actions",
        methods: ["GET", "POST"]
      },
      {
        path: "/api/devices/[deviceCode]",
        description: "Get details of a specific device",
        methods: ["GET"]
      },
      {
        path: "/api/tests/failed",
        description: "Get data about failed tests",
        methods: ["GET"]
      },
      {
        path: "/api/tests/top",
        description: "Get data about top fails",
        methods: ["GET"]
      },
      {
        path: "/api/stations",
        description: "Get data about stations",
        methods: ["GET"]
      }
    ]
  };

  return NextResponse.json(apiInfo);
}