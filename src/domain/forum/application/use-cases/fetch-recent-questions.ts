import { QuestionRepository } from '../repositories/question-repository'
import { Question } from '../../enterprise/entities/question'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

interface FetchRecentQuestionsUseCaseRequest {
  page: number
}

type FetchRecentQuestionsUseCaseResponse = Either<
  null,
  {
    questions: Question[]
  }
>

@Injectable()
export class FetchRecentQuestionsUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
    const questions = await this.questionRepository.findManyRecent({ page })

    return right({
      questions,
    })
  }
}
