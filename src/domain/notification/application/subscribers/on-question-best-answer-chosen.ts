import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/domain-handler'
import { SendNotificationUseCase } from '../use-case/send-notification'
import { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository'
import { QuestionBestAnswerChosenEvent } from '@/domain/forum/enterprise/events/question-best-answer-chosen-event'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answerRepository: AnswerRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionBestAnswerNotification.bind(this),
      QuestionBestAnswerChosenEvent.name,
    )
  }

  private async sendQuestionBestAnswerNotification({
    question,
    bestAnswerId,
  }: QuestionBestAnswerChosenEvent) {
    await this.answerRepository.findById(bestAnswerId.toString())

    if (question) {
      this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: 'Sua resposta foi marcado como Melhor Resposta',
        content: `A resposta enviada em "${question.title
          .substring(0, 20)
          .concat('...')}" foi marcada como a melhor`,
      })
    }
  }
}
