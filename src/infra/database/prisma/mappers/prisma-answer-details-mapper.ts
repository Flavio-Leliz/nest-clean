import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerDetails } from '@/domain/forum/enterprise/entities/value-object/answer-details'
import {
  Answer as PrismaAnswer,
  User as PrismaUser,
  Attachment as PrismaAttachment,
} from '@prisma/client'
import { PrismaAttachmentMapper } from './prisma-attachment-mapper'

type PrismaAnswerDetails = PrismaAnswer & {
  author: PrismaUser
  attachments: PrismaAttachment[]
}

export class PrismaAnswerDetailsMapper {
  static toDomain(raw: PrismaAnswerDetails): AnswerDetails {
    return AnswerDetails.create({
      answerId: new UniqueEntityID(raw.id),
      authorId: new UniqueEntityID(raw.authorId),
      author: raw.author.name,
      content: raw.content,
      attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
