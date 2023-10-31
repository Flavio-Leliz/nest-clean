import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerComments } from '../../enterprise/entities/answer-comments'
import { CommentWithAuthor } from '../../enterprise/entities/value-object/comment-with-author'

export abstract class AnswerCommentsRepository {
  abstract create(answerComment: AnswerComments): Promise<void>

  abstract delete(answerComment: AnswerComments): Promise<void>

  abstract findById(id: string): Promise<AnswerComments | null>

  abstract findManyByAnswerId(
    answerId: string,
    params: PaginationParams,
  ): Promise<AnswerComments[]>

  abstract findManyByAnswerIdCommentsWithAuthor(
    answerId: string,
    params: PaginationParams,
  ): Promise<CommentWithAuthor[]>
}
