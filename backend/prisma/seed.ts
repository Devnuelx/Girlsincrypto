import { PrismaClient, Role, TenantStatus, ProductType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// E-book download URL
const EBOOK_URL = 'https://u.pcloud.link/publink/show?code=XZc1AK5ZIvw02RBJKGJU9AwKBxxf6hRUnfG7';

async function main() {
    console.log('🌱 Seeding database...');

    // ============================================
    // 1. Create GICH Tenant (Tenant #1)
    // ============================================
    let gichTenant = await prisma.tenant.findUnique({
        where: { slug: 'gich' },
    });

    if (!gichTenant) {
        gichTenant = await prisma.tenant.create({
            data: {
                name: 'Girls in Crypto Hub',
                slug: 'gich',
                status: TenantStatus.ACTIVE,
            },
        });
        console.log('✅ Created GICH tenant');
    } else {
        console.log('ℹ️ GICH tenant already exists');
    }

    // ============================================
    // 2. Create sample WhatsApp groups
    // ============================================
    const existingGroups = await prisma.whatsappGroup.count({
        where: { tenantId: gichTenant.id },
    });

    if (existingGroups === 0) {
        await prisma.whatsappGroup.createMany({
            data: [
                {
                    tenantId: gichTenant.id,
                    name: 'GICH Circle #01',
                    inviteLink: 'https://chat.whatsapp.com/EXAMPLE_LINK_1',
                    maxClicks: 900,
                    isActive: true,
                },
                {
                    tenantId: gichTenant.id,
                    name: 'GICH Circle #02',
                    inviteLink: 'https://chat.whatsapp.com/EXAMPLE_LINK_2',
                    maxClicks: 900,
                    isActive: true,
                },
                {
                    tenantId: gichTenant.id,
                    name: 'GICH Circle #03',
                    inviteLink: 'https://chat.whatsapp.com/EXAMPLE_LINK_3',
                    maxClicks: 900,
                    isActive: true,
                },
            ],
        });
        console.log('✅ Created 3 sample WhatsApp groups');
    } else {
        console.log(`ℹ️ ${existingGroups} WhatsApp groups already exist`);
    }

    // ============================================
    // 3. Create Admin User
    // ============================================
    const adminEmail = 'admin@girlsincryptohub.com';
    let admin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (!admin) {
        const passwordHash = await bcrypt.hash('Admin123!', 12);
        admin = await prisma.user.create({
            data: {
                email: adminEmail,
                passwordHash,
                firstName: 'Admin',
                lastName: 'User',
                role: Role.ADMIN,
            },
        });
        console.log(`✅ Admin user created: ${adminEmail} / Admin123!`);
    } else {
        console.log(`ℹ️ Admin user already exists: ${adminEmail}`);
    }

    // ============================================
    // 4. Create/Update Products with E-book URL
    // ============================================
    const products = [
        {
            title: 'Crypto Beginners Guide',
            price: 99.0,
            type: ProductType.EBOOK,
            description: 'Master the fundamentals of cryptocurrency.',
            fileUrl: EBOOK_URL,
        },
        {
            title: 'Crypto Investing Starterpack',
            price: 99.0,
            type: ProductType.EBOOK,
            description: 'Your complete guide to starting your crypto investment journey.',
            fileUrl: EBOOK_URL,
        },
        {
            title: 'The Memecoin Edge',
            price: 99.0,
            type: ProductType.EBOOK,
            description: 'Navigate the world of memecoins.',
            fileUrl: EBOOK_URL,
        },
        {
            title: 'Understanding Web3',
            price: 99.0,
            type: ProductType.EBOOK,
            description: 'Comprehensive guide to blockchain technology.',
            fileUrl: EBOOK_URL,
        },
        {
            title: 'One Week Onboarding',
            price: 599.0,
            type: ProductType.MENTORSHIP,
            description: 'Personalized 1-on-1 guidance with Calendly booking.',
            fileUrl: null,
        },
    ];

    let productsCreated = 0;
    let productsUpdated = 0;

    for (const product of products) {
        const existing = await prisma.product.findFirst({
            where: { title: product.title },
        });

        if (existing) {
            await prisma.product.update({
                where: { id: existing.id },
                data: { fileUrl: product.fileUrl, description: product.description },
            });
            productsUpdated++;
        } else {
            await prisma.product.create({ data: product });
            productsCreated++;
        }
    }
    console.log(`✅ Products: ${productsCreated} created, ${productsUpdated} updated`);

    console.log('\n🎉 Seed complete!');
    console.log('\n📋 Summary:');
    console.log(`   Tenant: ${gichTenant.name} (${gichTenant.slug})`);
    console.log(`   WhatsApp Groups: ${existingGroups > 0 ? existingGroups : 3}`);
    console.log(`   Admin: ${adminEmail} / Admin123!`);
    console.log(`   Products: ${products.length} (with e-book URL)`);
    console.log(`\n🔗 Rotator URL: http://localhost:3001/api/gich/join`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => {
        prisma.$disconnect();
    });
