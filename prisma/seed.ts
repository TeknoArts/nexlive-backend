import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const LIVE_STREAM_URL = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

const VOD_VIDEOS = [
  {
    title: 'Big Buck Bunny',
    description: 'A large and lovable rabbit deals with three tiny bullies, led by a flying squirrel, who are determined to squelch his happiness.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg',
    duration: 596,
    category: 'Animation',
  },
  {
    title: 'Sintel',
    description: 'A lonely young woman searches for a baby dragon she raised after it was stolen from her.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    thumbnail: 'https://durian.blender.org/wp-content/uploads/2010/07/sintel_poster.jpg',
    duration: 888,
    category: 'Fantasy',
  },
  {
    title: 'Tears of Steel',
    description: 'In an apocalyptic world, a group of soldiers and scientists try to save humanity from an alien invasion.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnail: 'https://mango.blender.org/wp-content/uploads/2013/05/tears_of_steel_poster.jpg',
    duration: 734,
    category: 'Sci-Fi',
  },
  {
    title: 'Elephants Dream',
    description: 'Two strange characters explore a surreal mechanical world.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://orange.blender.org/wp-content/uploads/2015/10/elephants_dream_poster.jpg',
    duration: 653,
    category: 'Animation',
  },
];

async function main() {
  const hashedPassword = await bcrypt.hash('Demo123!', 10);

  // Delete existing data first to ensure clean state
  await prisma.transaction.deleteMany({});
  await prisma.watchlistItem.deleteMany({});
  await prisma.wallet.deleteMany({});
  await prisma.schedule.deleteMany({});
  await prisma.channel.deleteMany({});
  await prisma.vodItem.deleteMany({});
  await prisma.partner.deleteMany({});
  await prisma.voucher.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.category.deleteMany({});

  // Create demo users
  const viewer = await prisma.user.create({
    data: {
      email: 'viewer@nexlive.test',
      password: hashedPassword,
      name: 'Demo Viewer',
      role: 'VIEWER',
      wallet: {
        create: {
          balance: 25.50,
          currency: 'USD',
        },
      },
    },
  });

  const partnerUser = await prisma.user.create({
    data: {
      email: 'partner@nexlive.test',
      password: hashedPassword,
      name: 'Demo Partner',
      role: 'PARTNER',
      partner: {
        create: {
          name: 'NexLive Broadcasting',
          description: 'Premium content partner',
          streamKey: 'demo-partner-stream-key',
        },
      },
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@nexlive.test',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  const partner = await prisma.partner.findUnique({
    where: { userId: partnerUser.id },
  });

  if (!partner) {
    throw new Error('Partner not created');
  }

  // Create categories
  const categoryData = [
    { name: 'Sports', slug: 'sports', description: 'Live sports events and highlights' },
    { name: 'Education', slug: 'education', description: 'Educational content and learning' },
    { name: 'Tourism', slug: 'tourism', description: 'Travel and tourism content' },
    { name: 'News', slug: 'news', description: 'Breaking news and updates' },
    { name: 'Animation', slug: 'animation', description: 'Animated content' },
    { name: 'Fantasy', slug: 'fantasy', description: 'Fantasy genre content' },
    { name: 'Sci-Fi', slug: 'sci-fi', description: 'Science fiction content' },
    { name: 'Documentary', slug: 'documentary', description: 'Documentary films' },
    { name: 'Drama', slug: 'drama', description: 'Drama genre content' },
    { name: 'Comedy', slug: 'comedy', description: 'Comedy content' },
  ];

  const categories = {};
  for (let i = 0; i < categoryData.length; i++) {
    const cat = await prisma.category.create({
      data: {
        ...categoryData[i],
        sortOrder: i,
        isActive: true,
      },
    });
    categories[cat.name] = cat.id;
  }

  // Create live channels
  const channelCategories = ['Sports', 'Education', 'Tourism', 'News'];
  const channelNames = [
    ['Premier League Live', 'Champions League', 'World Cup Highlights'],
    ['Science Channel', 'History Today', 'Learn Coding'],
    ['Travel Africa', 'Explore Asia', 'European Destinations'],
    ['Breaking News', 'Global Updates', 'Local News'],
  ];

  const channels = [];
  for (let i = 0; i < channelCategories.length; i++) {
    const categoryId = categories[channelCategories[i]];
    for (let j = 0; j < channelNames[i].length; j++) {
      const channel = await prisma.channel.create({
        data: {
          partnerId: partner.id,
          categoryId,
          name: channelNames[i][j],
          description: `${channelNames[i][j]} - Live streaming channel`,
          streamUrl: LIVE_STREAM_URL,
          isLive: Math.random() > 0.5,
          isActive: true,
          viewers: Math.floor(Math.random() * 5000) + 100,
        },
      });
      channels.push(channel);
    }
  }

  // Create schedules for channels
  for (const channel of channels) {
    const now = new Date();
    for (let i = 0; i < 5; i++) {
      const startTime = new Date(now.getTime() + i * 2 * 60 * 60 * 1000);
      const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);
      await prisma.schedule.create({
        data: {
          channelId: channel.id,
          partnerId: partner.id,
          title: `Program ${i + 1} on ${channel.name}`,
          description: `Scheduled program`,
          startTime,
          endTime,
        },
      });
    }
  }

  // Create VOD items (repeat videos to get 24 items)
  const vodCategories = ['Animation', 'Fantasy', 'Sci-Fi', 'Documentary', 'Drama', 'Comedy'];
  for (let i = 0; i < 24; i++) {
    const video = VOD_VIDEOS[i % VOD_VIDEOS.length];
    const categoryName = vodCategories[i % vodCategories.length];
    const categoryId = categories[categoryName];
    await prisma.vodItem.create({
      data: {
        partnerId: partner.id,
        categoryId,
        title: `${video.title} ${i > 3 ? `(${Math.floor(i / 4) + 1})` : ''}`,
        description: video.description,
        videoUrl: video.videoUrl,
        thumbnail: video.thumbnail,
        duration: video.duration,
        views: Math.floor(Math.random() * 10000),
        isActive: true,
        isFeatured: i < 4,
        tags: JSON.stringify(['demo', 'sample', categoryName.toLowerCase()]),
      },
    });
  }

  // Create voucher codes
  const voucherCodes = [];
  for (let i = 0; i < 20; i++) {
    const code = `NEX${String(i + 1).padStart(3, '0')}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    
    const voucher = await prisma.voucher.create({
      data: {
        code,
        amount: [5, 10, 20, 50][Math.floor(Math.random() * 4)],
        currency: 'USD',
        expiresAt,
      },
    });
    voucherCodes.push(voucher.code);
  }

  console.log('✅ Seed data created successfully!');
  console.log('\n📧 Demo Accounts:');
  console.log('  Viewer: viewer@nexlive.test / Demo123!');
  console.log('  Partner: partner@nexlive.test / Demo123!');
  console.log('  Admin: admin@nexlive.test / Demo123!');
  console.log(`\n🎫 Sample Voucher Codes: ${voucherCodes.slice(0, 5).join(', ')}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
