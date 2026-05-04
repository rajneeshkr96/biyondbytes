const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const email = 'gkashish1985@gmail.com';
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      console.log('User not found:', email);
      return;
    }
    
    console.log('--- USER INFO ---');
    console.log('Name:', user.name);
    console.log('MongoDB ID:', user.id);
    
    const blogsByMongoId = await prisma.blog.findMany({ where: { authorId: user.id } });
    console.log('Blogs by MongoDB ID:', blogsByMongoId.length);
    
    console.log('\n--- SAMPLE BLOGS ---');
    const sampleBlogs = await prisma.blog.findMany({ take: 10 });
    sampleBlogs.forEach(b => {
      console.log(`Title: ${b.title.substring(0, 30)}... | AuthorId: ${b.authorId}`);
    });

  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
