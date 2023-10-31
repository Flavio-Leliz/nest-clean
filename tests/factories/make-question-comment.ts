import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  QuestionComments,
  QuestionCommentsProps,
} from '@/domain/forum/enterprise/entities/question-comments'
import { PrismaQuestionCommentMapper } from '@/infra/database/prisma/mappers/prisma-question-comment-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeQuestionComment(
  override: Partial<QuestionCommentsProps> = {},
  id?: UniqueEntityID,
) {
  const questionComment = QuestionComments.create(
    {
      authorId: new UniqueEntityID(),
      questionId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )

  return questionComment
}

@Injectable()
export class QuestionCommentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestionComment(
    data: Partial<QuestionCommentsProps> = {},
  ): Promise<QuestionComments> {
    const questionComment = makeQuestionComment(data)

    await this.prisma.comment.create({
      data: PrismaQuestionCommentMapper.toPrisma(questionComment),
    })

    return questionComment
  }
}
