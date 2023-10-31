import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaQuestionRepository } from './prisma/repositories/prisma-question-repository'
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments-repository'
import { PrismaQuestionAttachmentRepository } from './prisma/repositories/prisma-question-attachment-repository'
import { PrismaAnswerRepository } from './prisma/repositories/prisma-answer-repository'
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comments-repository'
import { PrismaAnswerAttachmentRepository } from './prisma/repositories/prisma-answer-attachment-repository'
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { StudentRepository } from '@/domain/forum/application/repositories/students-repository'
import { PrismaStudentRepository } from './prisma/repositories/prisma-student-repository'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachment-repository'
import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachment-repository'
import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository'
import { PrismaAttachmentsRepository } from './prisma/repositories/prisma-attachments-repository'
import { NotificationsRepository } from '@/domain/notification/application/respositories/notifications-repository'
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notifications-repository'
import { CacheModule } from '../cache/cache.module'

@Module({
  imports: [CacheModule],
  providers: [
    PrismaService,
    {
      provide: QuestionRepository,
      useClass: PrismaQuestionRepository,
    },
    {
      provide: StudentRepository,
      useClass: PrismaStudentRepository,
    },
    {
      provide: QuestionCommentsRepository,
      useClass: PrismaQuestionCommentsRepository,
    },
    {
      provide: QuestionAttachmentRepository,
      useClass: PrismaQuestionAttachmentRepository,
    },
    PrismaQuestionAttachmentRepository,
    { provide: AnswerRepository, useClass: PrismaAnswerRepository },
    {
      provide: AnswerCommentsRepository,
      useClass: PrismaAnswerCommentsRepository,
    },
    {
      provide: AnswerAttachmentRepository,
      useClass: PrismaAnswerAttachmentRepository,
    },
    {
      provide: AttachmentsRepository,
      useClass: PrismaAttachmentsRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
  ],
  exports: [
    PrismaService,
    QuestionRepository,
    StudentRepository,
    QuestionCommentsRepository,
    QuestionAttachmentRepository,
    AnswerRepository,
    AnswerCommentsRepository,
    AnswerAttachmentRepository,
    AttachmentsRepository,
    NotificationsRepository,
  ],
})
export class DatabaseModule {}
