import { PrismaClient, Role, TenantStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

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

    console.log('\n🎉 Seed complete!');
    console.log('\n📋 Summary:');
    console.log(`   Tenant: ${gichTenant.name} (${gichTenant.slug})`);
    console.log(`   WhatsApp Groups: ${existingGroups > 0 ? existingGroups : 3}`);
    console.log(`   Admin: ${adminEmail}`);
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
