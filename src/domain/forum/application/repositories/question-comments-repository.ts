import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionComments } from '../../enterprise/entities/question-comments'
import { CommentWithAuthor } from '../../enterprise/entities/value-object/comment-with-author'

export abstract class QuestionCommentsRepository {
  abstract create(questionComment: QuestionComments): Promise<void>

  abstract delete(questionComment: QuestionComments): Promise<void>

  abstract findById(id: string): Promise<QuestionComments | null>

  abstract findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<QuestionComments[]>

  abstract findManyByQuestionIdWithAuthor(
    questionId: string,
    params: PaginationParams,
  ): Promise<CommentWithAuthor[]>
}
