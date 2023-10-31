import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { FetchQuestionsAnswerUseCase } from '@/domain/forum/application/use-cases/fetch-question-answer'
import { AnswerWithAuthorPresenter } from '../presenters/answer-with-author-presenter'

const pageQueryParamsSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema)

type PageQueryParamsSchema = z.infer<typeof pageQueryParamsSchema>

@Controller('/questions/:questionId/answers')
export class FetchQuestionAnswersController {
  constructor(private fetchRecentAnswer: FetchQuestionsAnswerUseCase) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamsSchema,
    @Param('questionId') questionId: string,
  ) {
    const result = await this.fetchRecentAnswer.execute({
      page,
      questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const answers = result.value.answers

    return { answers: answers.map(AnswerWithAuthorPresenter.toHTTP) }
  }
}
