import { AnswerDetails } from '@/domain/forum/enterprise/entities/value-object/answer-details'
import { AttachmentPresenter } from './attachment-presenter'

export class AnswerDetailsPresenter {
  static toHTTP(answerDetails: AnswerDetails) {
    return {
      answerId: answerDetails.answerId.toString(),
      authorId: answerDetails.authorId.toString(),
      author: answerDetails.author,
      content: answerDetails.content,
      attachments: answerDetails.attachments.map(AttachmentPresenter.toHTTP),
      createdAt: answerDetails.createdAt,
      updatedAt: answerDetails.updatedAt,
    }
  }
}
