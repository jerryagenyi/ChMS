import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/services/auth';
import { prisma } from '@/lib/prisma';
import { optimizeImage } from '@/services/image/image';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Maximum file size (e.g., 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Optimize image
    const { data: optimizedImage, type } = await optimizeImage(buffer);

    // Update user record with image data
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        image: optimizedImage,
        imageType: type,
      },
    });

    // Return base64 representation for immediate display
    const base64Image = `data:${type};base64,${optimizedImage.toString('base64')}`;
    return NextResponse.json({ url: base64Image });

  } catch (error) {
    console.error('Profile image upload error:', error);
    return NextResponse.json(
      { error: 'Error uploading profile image' },
      { status: 500 }
    );
  }
}

// Endpoint to fetch image
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true, imageType: true },
    });

    if (!user?.image || !user?.imageType) {
      return NextResponse.json({ error: 'No image found' }, { status: 404 });
    }

    // Return image with proper content type
    return new NextResponse(user.image, {
      headers: {
        'Content-Type': user.imageType,
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json(
      { error: 'Error fetching image' },
      { status: 500 }
    );
  }
}