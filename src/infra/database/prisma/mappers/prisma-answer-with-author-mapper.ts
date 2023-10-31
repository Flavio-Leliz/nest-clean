import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerWithAuthor } from '@/domain/forum/enterprise/entities/value-object/answer-with-author'
import { Answer as PrismaAnswer, User as PrismaUser } from '@prisma/client'

type PrismaAnswerWithAuthor = PrismaAnswer & {
  author: PrismaUser
}

export class PrismaAnswerWithAuthorMapper {
  static toDomain(raw: PrismaAnswerWithAuthor): AnswerWithAuthor {
    return AnswerWithAuthor.create({
      answerId: new UniqueEntityID(raw.id),
      questionId: new UniqueEntityID(raw.questionId),
      authorId: new UniqueEntityID(raw.authorId),
      author: raw.author.name,
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
