import { AnswerRepository } from '../repositories/answer-repository'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { AnswerWithAuthor } from '../../enterprise/entities/value-object/answer-with-author'

interface FetchQuestionsAnswerUseCaseRequest {
  questionId: string
  page: number
}

type FetchQuestionsAnswerUseCaseResponse = Either<
  null,
  {
    answers: AnswerWithAuthor[]
  }
>

@Injectable()
export class FetchQuestionsAnswerUseCase {
  constructor(private answerRepository: AnswerRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionsAnswerUseCaseRequest): Promise<FetchQuestionsAnswerUseCaseResponse> {
    const answers = await this.answerRepository.findByAnswerWithAuthor(
      questionId,
      {
        page,
      },
    )

    return right({
      answers,
    })
  }
}
