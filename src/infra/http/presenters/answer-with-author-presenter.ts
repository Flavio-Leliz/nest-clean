import { AnswerWithAuthor } from '@/domain/forum/enterprise/entities/value-object/answer-with-author'

export class AnswerWithAuthorPresenter {
  static toHTTP(answerWithAuthor: AnswerWithAuthor) {
    return {
      authorId: answerWithAuthor.authorId,
      questionId: answerWithAuthor.questionId,
      content: answerWithAuthor.content,
      author: answerWithAuthor.author,
      attachments: answerWithAuthor.attachments,
      createdAt: answerWithAuthor.createdAt,
      updatedAt: answerWithAuthor.updatedAt,
    }
  }
}
