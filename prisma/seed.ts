import { PrismaClient, UserRole, PostType, CreatorRank } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar datos existentes
  console.log('🧹 Limpiando datos existentes...');
  await prisma.autoModFlag.deleteMany();
  await prisma.report.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.platformSettings.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.verificationSubmission.deleteMany();
  await prisma.userAchievement.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.fanList.deleteMany();
  await prisma.storyItem.deleteMany();
  await prisma.story.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversationParticipant.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.blockedUser.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.ppvPurchase.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.like.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.post.deleteMany();
  await prisma.creator.deleteMany();
  await prisma.user.deleteMany();

  // Crear configuración de plataforma
  console.log('⚙️ Creando configuración de plataforma...');
  await prisma.platformSettings.create({
    data: {
      id: 'singleton',
      commissionRatesJson: {
        BRONZE: 0.20,
        SILVER: 0.18,
        GOLD: 0.15,
        PLATINUM: 0.12,
        DIAMOND: 0.10
      },
      featuredCreatorIdsJson: [],
      categoriesJson: [
        {
          id: 1,
          name: 'Arte y Creatividad',
          slug: 'arte',
          children: [
            { id: 11, name: 'Fotografía', slug: 'fotografia', children: [] },
            { id: 12, name: 'Pintura', slug: 'pintura', children: [] },
            { id: 13, name: 'Diseño Digital', slug: 'diseno-digital', children: [] }
          ]
        },
        {
          id: 2,
          name: 'Fitness y Bienestar',
          slug: 'fitness',
          children: [
            { id: 21, name: 'Yoga', slug: 'yoga', children: [] },
            { id: 22, name: 'Entrenamiento', slug: 'entrenamiento', children: [] },
            { id: 23, name: 'Nutrición', slug: 'nutricion', children: [] }
          ]
        },
        {
          id: 3,
          name: 'Música',
          slug: 'musica',
          children: [
            { id: 31, name: 'Pop', slug: 'pop', children: [] },
            { id: 32, name: 'Rock', slug: 'rock', children: [] },
            { id: 33, name: 'Electrónica', slug: 'electronica', children: [] }
          ]
        }
      ]
    }
  });

  // Crear achievements
  console.log('🏆 Creando sistema de logros...');
  const achievements = await Promise.all([
    prisma.achievement.create({
      data: {
        name: 'Primer Tip',
        description: 'Envía tu primer tip a un creador',
        icon: '💸',
        criteriaJson: { type: 'first_tip' }
      }
    }),
    prisma.achievement.create({
      data: {
        name: 'Explorador',
        description: 'Visita 100 perfiles de creadores',
        icon: '🧭',
        criteriaJson: { type: 'profile_visits', target: 100 }
      }
    }),
    prisma.achievement.create({
      data: {
        name: 'Mecenas',
        description: 'Suscríbete a 10 creadores',
        icon: '👑',
        criteriaJson: { type: 'subscriptions', target: 10 }
      }
    }),
    prisma.achievement.create({
      data: {
        name: 'Primeros 1,000 Likes',
        description: 'Recibe 1,000 likes en tus posts',
        icon: '❤️',
        criteriaJson: { type: 'total_likes', target: 1000 }
      }
    }),
    prisma.achievement.create({
      data: {
        name: 'Post Viral',
        description: 'Recibe 100 likes en 24 horas',
        icon: '🚀',
        criteriaJson: { type: 'viral_post', likes: 100, hours: 24 }
      }
    })
  ]);

  // Crear usuarios de prueba
  console.log('👥 Creando usuarios de prueba...');
  
  // Admin
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@thefreed.com',
      username: 'AdminUser',
      role: UserRole.ADMIN,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      isAgeVerified: true,
      fullName: 'Administrador',
      registeredAt: new Date('2025-01-01')
    }
  });

  // Fan de prueba
  const fanUser = await prisma.user.create({
    data: {
      email: 'fan@test.com',
      username: 'MyFan',
      role: UserRole.FAN,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fan',
      isAgeVerified: true,
      showSensitiveContent: true,
      fullName: 'Juan Fan',
      dateOfBirth: new Date('1995-05-15'),
      registeredAt: new Date('2025-02-01')
    }
  });

  // Creador de prueba
  const creatorUser = await prisma.user.create({
    data: {
      email: 'creator@test.com',
      username: 'aurora_arts',
      role: UserRole.CREATOR,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aurora',
      isAgeVerified: true,
      fullName: 'Aurora Martinez',
      dateOfBirth: new Date('1992-08-20'),
      registeredAt: new Date('2025-01-15')
    }
  });

  // Crear perfil de creador
  const creator = await prisma.creator.create({
    data: {
      userId: creatorUser.id,
      displayName: 'Aurora Arts',
      bio: 'Artista digital especializada en arte fantástico y retratos. Creando mundos mágicos pixel a pixel ✨',
      location: 'Barcelona, España',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aurora',
      bannerUrl: 'https://picsum.photos/1200/400?random=aurora',
      monthlyPrice: 15.99,
      isVerified: true,
      followerCount: 1250,
      subscriberCount: 89,
      totalEarnings: 5420.50,
      mainCategory: 'Arte y Creatividad',
      subCategories: ['Diseño Digital', 'Fotografía'],
      rank: CreatorRank.GOLD,
      creatorScore: 4.8,
      globalPercentile: 85.5,
      socialLinksJson: [
        { type: 'instagram', url: 'https://instagram.com/aurora_arts' },
        { type: 'twitter', url: 'https://twitter.com/aurora_arts' },
        { type: 'website', url: 'https://aurora-arts.com' }
      ],
      subscriptionPackagesJson: [
        { months: 3, price: 45.99 },
        { months: 6, price: 85.99 },
        { months: 12, price: 159.99 }
      ]
    }
  });

  // Crear suscripción del fan al creador
  await prisma.subscription.create({
    data: {
      userId: fanUser.id,
      creatorId: creator.id,
      monthlyPrice: 15.99,
      expiresAt: new Date('2025-12-01'),
      packageMonths: 1
    }
  });

  // Crear follow
  await prisma.follow.create({
    data: {
      followerId: fanUser.id,
      creatorId: creator.id
    }
  });

  // Crear posts de ejemplo
  console.log('📝 Creando posts de ejemplo...');
  
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        text: '¡Nuevo arte digital terminado! ¿Qué les parece este retrato fantástico? ✨🎨',
        type: PostType.PUBLIC,
        creatorId: creator.id,
        authorId: creatorUser.id,
        mediaJson: [
          { type: 'image', url: 'https://picsum.photos/800/600?random=art1' }
        ],
        likeCount: 45,
        commentCount: 8,
        viewCount: 156,
        publishedAt: new Date('2025-10-20T10:30:00Z')
      }
    }),
    prisma.post.create({
      data: {
        text: 'Proceso de creación de mi última obra. Solo para suscriptores 💎',
        type: PostType.SUBSCRIBER_ONLY,
        creatorId: creator.id,
        authorId: creatorUser.id,
        mediaJson: [
          { type: 'image', url: 'https://picsum.photos/800/600?random=process1' },
          { type: 'image', url: 'https://picsum.photos/800/600?random=process2' }
        ],
        likeCount: 23,
        commentCount: 5,
        viewCount: 67,
        publishedAt: new Date('2025-10-22T15:45:00Z')
      }
    }),
    prisma.post.create({
      data: {
        text: 'Contenido exclusivo premium - Tutorial completo de iluminación digital',
        type: PostType.PAY_PER_VIEW,
        ppvPrice: 9.99,
        creatorId: creator.id,
        authorId: creatorUser.id,
        mediaJson: [
          { type: 'video', url: 'https://example.com/tutorial-video.mp4' }
        ],
        likeCount: 12,
        commentCount: 3,
        viewCount: 34,
        publishedAt: new Date('2025-10-24T12:00:00Z')
      }
    })
  ]);

  // Crear likes
  await prisma.like.create({
    data: {
      userId: fanUser.id,
      postId: posts[0].id
    }
  });

  // Crear comentarios
  await prisma.comment.create({
    data: {
      userId: fanUser.id,
      postId: posts[0].id,
      text: '¡Increíble trabajo Aurora! Los detalles son impresionantes 🤩'
    }
  });

  // Crear bookmark
  await prisma.bookmark.create({
    data: {
      userId: fanUser.id,
      postId: posts[1].id
    }
  });

  // Crear transacciones
  console.log('💰 Creando transacciones de ejemplo...');
  
  await Promise.all([
    prisma.transaction.create({
      data: {
        type: 'SUBSCRIPTION',
        amount: 15.99,
        platformFee: 2.40,
        creatorPayout: 13.59,
        description: 'Suscripción mensual - Aurora Arts',
        userId: fanUser.id,
        creatorId: creatorUser.id
      }
    }),
    prisma.transaction.create({
      data: {
        type: 'TIP',
        amount: 5.00,
        platformFee: 0.75,
        creatorPayout: 4.25,
        description: 'Propina por el arte increíble',
        userId: fanUser.id,
        creatorId: creatorUser.id
      }
    })
  ]);

  // Crear conversación y mensajes
  console.log('💬 Creando mensajes de ejemplo...');
  
  const conversation = await prisma.conversation.create({
    data: {
      lastMessageAt: new Date()
    }
  });

  await Promise.all([
    prisma.conversationParticipant.create({
      data: {
        conversationId: conversation.id,
        userId: fanUser.id
      }
    }),
    prisma.conversationParticipant.create({
      data: {
        conversationId: conversation.id,
        userId: creatorUser.id
      }
    })
  ]);

  await Promise.all([
    prisma.message.create({
      data: {
        content: 'Hola Aurora! Me encanta tu trabajo ✨',
        senderId: fanUser.id,
        receiverId: creatorUser.id,
        conversationId: conversation.id,
        isRead: true
      }
    }),
    prisma.message.create({
      data: {
        content: '¡Hola! Muchas gracias, me alegra que te guste 😊',
        senderId: creatorUser.id,
        receiverId: fanUser.id,
        conversationId: conversation.id,
        isRead: false
      }
    })
  ]);

  // Crear notificaciones
  await prisma.notification.create({
    data: {
      type: 'LIKE',
      message: 'A MyFan le gustó tu post',
      linkTo: `/post/${posts[0].id}`,
      userId: creatorUser.id,
      actorId: fanUser.id
    }
  });

  // Asignar achievements
  await prisma.userAchievement.create({
    data: {
      userId: fanUser.id,
      achievementId: achievements[0].id // Primer Tip
    }
  });

  // Crear anuncio global
  await prisma.announcement.create({
    data: {
      title: '¡Bienvenidos a TheFreed!',
      content: 'Nuestra plataforma ya está en funcionamiento. ¡Disfruta creando y descubriendo contenido increíble!',
      target: 'ALL',
      isActive: true
    }
  });

  console.log('✅ Seed completado exitosamente!');
  console.log('📊 Datos creados:');
  console.log(`   👤 Usuarios: ${await prisma.user.count()}`);
  console.log(`   🎨 Creadores: ${await prisma.creator.count()}`);
  console.log(`   📝 Posts: ${await prisma.post.count()}`);
  console.log(`   💰 Transacciones: ${await prisma.transaction.count()}`);
  console.log(`   💬 Mensajes: ${await prisma.message.count()}`);
  console.log(`   🏆 Logros: ${await prisma.achievement.count()}`);
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });