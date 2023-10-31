import { PaginationParams } from '@/core/repositories/pagination-params'
import { Answer } from '../../enterprise/entities/answer'
import { AnswerDetails } from '../../enterprise/entities/value-object/answer-details'
import { AnswerWithAuthor } from '../../enterprise/entities/value-object/answer-with-author'

export abstract class AnswerRepository {
  abstract create(answer: Answer): Promise<void>

  abstract delete(answer: Answer): Promise<void>

  abstract findById(id: string): Promise<Answer | null>

  abstract findByAnswerWithAuthor(
    questionId: string,
    params: PaginationParams,
  ): Promise<AnswerWithAuthor[]>

  abstract findDetailsById(id: string): Promise<AnswerDetails | null>

  abstract findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<Answer[]>

  abstract save(answer: Answer): Promise<void>
}
