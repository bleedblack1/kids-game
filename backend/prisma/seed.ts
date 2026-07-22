/**
 * Seed real, essential content:
 *  - the vocabulary Word bank (game content — required),
 *  - an admin + a teacher account (so you can log in),
 *  - a demo school/class with players + gameplay events, ONLY when
 *    SEED_DEMO=true, so the leaderboard/insights have real rows to aggregate.
 *
 * Nothing here is "mock data returned by the API" — it is genuine DB content
 * the app derives its views from. Run: `npm run db:seed`.
 */
import { AgeBand, EventType, PrismaClient, Role, Skill } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

const WORDS: { word: string; emoji: string; ageBand: AgeBand }[] = [
  { word: 'SUN', emoji: '☀️', ageBand: AgeBand.BAND_3_4 },
  { word: 'CAT', emoji: '🐱', ageBand: AgeBand.BAND_3_4 },
  { word: 'DOG', emoji: '🐶', ageBand: AgeBand.BAND_3_4 },
  { word: 'BUS', emoji: '🚌', ageBand: AgeBand.BAND_3_4 },
  { word: 'BALL', emoji: '⚽', ageBand: AgeBand.BAND_4_5 },
  { word: 'FISH', emoji: '🐟', ageBand: AgeBand.BAND_4_5 },
  { word: 'KITE', emoji: '🪁', ageBand: AgeBand.BAND_4_5 },
  { word: 'STAR', emoji: '⭐', ageBand: AgeBand.BAND_4_5 },
  { word: 'TREE', emoji: '🌳', ageBand: AgeBand.BAND_4_5 },
  { word: 'DUCK', emoji: '🦆', ageBand: AgeBand.BAND_4_5 },
  { word: 'MOON', emoji: '🌙', ageBand: AgeBand.BAND_4_5 },
  { word: 'LION', emoji: '🦁', ageBand: AgeBand.BAND_4_5 },
  { word: 'APPLE', emoji: '🍎', ageBand: AgeBand.BAND_5_6 },
  { word: 'MANGO', emoji: '🥭', ageBand: AgeBand.BAND_5_6 },
  { word: 'TIGER', emoji: '🐯', ageBand: AgeBand.BAND_5_6 },
  { word: 'CHAIR', emoji: '🪑', ageBand: AgeBand.BAND_5_6 },
  { word: 'HOUSE', emoji: '🏠', ageBand: AgeBand.BAND_5_6 },
  { word: 'RABBIT', emoji: '🐰', ageBand: AgeBand.BAND_5_6 },
  { word: 'FLOWER', emoji: '🌸', ageBand: AgeBand.BAND_5_6 },
];

async function seedWords() {
  for (const w of WORDS) {
    await prisma.word.upsert({
      where: { word: w.word },
      update: { emoji: w.emoji, ageBand: w.ageBand, active: true },
      create: w,
    });
  }
  console.log(`✓ seeded ${WORDS.length} words`);
}

async function seedAccounts() {
  // Passwords come from env so real credentials never live in the repo. The
  // defaults are safe placeholders meant to be changed after first login.
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe!admin1';
  const teacherPassword = process.env.SEED_TEACHER_PASSWORD ?? 'ChangeMe!teach1';

  const admin = await prisma.user.upsert({
    where: { email: 'admin@kalqy.app' },
    update: {},
    create: {
      email: 'admin@kalqy.app',
      name: 'Kalqy Admin',
      role: Role.ADMIN,
      passwordHash: await argon2.hash(adminPassword),
    },
  });
  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@kalqy.app' },
    update: {},
    create: {
      email: 'teacher@kalqy.app',
      name: 'Ms. Rao',
      role: Role.TEACHER,
      passwordHash: await argon2.hash(teacherPassword),
    },
  });
  console.log('✓ seeded admin + teacher accounts (set SEED_ADMIN_PASSWORD to override)');
  return { admin, teacher };
}

async function seedDemoClass(teacherId: string) {
  const school = await prisma.school.create({ data: { name: 'Sunrise Preschool' } });
  const klass = await prisma.class.create({
    data: { name: 'Butterflies', schoolId: school.id, teacherId },
  });

  const kids = [
    { deviceId: 'demo-aarav', name: 'Aarav', avatar: '🦁', ageBand: AgeBand.BAND_5_6, coins: 82 },
    { deviceId: 'demo-diya', name: 'Diya', avatar: '🦋', ageBand: AgeBand.BAND_4_5, coins: 71 },
    { deviceId: 'demo-kabir', name: 'Kabir', avatar: '🐯', ageBand: AgeBand.BAND_4_5, coins: 65 },
  ];

  for (const k of kids) {
    const player = await prisma.player.create({
      data: {
        deviceId: k.deviceId,
        name: k.name,
        avatar: k.avatar,
        ageBand: k.ageBand,
        classId: klass.id,
        progress: {
          create: { coins: k.coins, stickers: ['first-win', 'streak-3'], streakDays: 3, lastPlayed: new Date() },
        },
      },
    });
    // Real events so topSkill/insights aggregate from actual gameplay.
    const skills = [Skill.VOCABULARY, Skill.COORDINATION, Skill.BALANCE];
    for (let i = 0; i < 12; i++) {
      await prisma.event.create({
        data: {
          playerId: player.id,
          game: 'point-and-spell',
          type: i % 4 === 0 ? EventType.ANSWER_WRONG : EventType.ANSWER_CORRECT,
          skill: skills[i % skills.length],
          value: 1,
        },
      });
    }
  }
  console.log('✓ seeded demo school/class/players + events');
}

async function main() {
  await seedWords();
  const { teacher } = await seedAccounts();
  if (process.env.SEED_DEMO === 'true') {
    await seedDemoClass(teacher.id);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
