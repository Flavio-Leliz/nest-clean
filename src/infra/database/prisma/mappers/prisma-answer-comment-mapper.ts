import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerComments } from '@/domain/forum/enterprise/entities/answer-comments'
import { Comment as PrismaComment, Prisma } from '@prisma/client'

export class PrismaAnswerCommentMapper {
  static toDomain(raw: PrismaComment): AnswerComments {
    if (!raw.answerId) {
      throw new Error('Invalid comment type')
    }

    return AnswerComments.create(
      {
        content: raw.content,
        authorId: new UniqueEntityID(raw.authorId),
        answerId: new UniqueEntityID(raw.answerId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    answerComment: AnswerComments,
  ): Prisma.CommentUncheckedCreateInput {
    return {
      id: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
      answerId: answerComment.answerId.toString(),
      content: answerComment.content,
      createdAt: answerComment.createdAt,
      updatedAt: answerComment.updateAt,
    }
  }
}
