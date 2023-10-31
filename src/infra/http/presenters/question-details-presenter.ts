import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-object/question-details'
import { AttachmentPresenter } from './attachment-presenter'

export class QuestionDetailsPresenter {
  static toHTTP(questionDetails: QuestionDetails) {
    return {
      questionId: questionDetails.questionId.toString(),
      authorId: questionDetails.authorId.toString(),
      author: questionDetails.author,
      title: questionDetails.title,
      slug: questionDetails.slug.value,
      content: questionDetails.content,
      attachments: questionDetails.attachments.map(AttachmentPresenter.toHTTP),
      bestAnswerId: questionDetails.bestAnswerId?.toString(),
      createdAt: questionDetails.createdAt,
      updatedAt: questionDetails.updatedAt,
    }
  }
}
