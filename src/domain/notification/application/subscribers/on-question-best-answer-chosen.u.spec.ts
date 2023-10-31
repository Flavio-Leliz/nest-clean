import { makeAnswer } from 'tests/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'tests/repositories/in-memory-answer-attachment-repository'
import { InMemoryAnswerRepository } from 'tests/repositories/in-memory-answer-repository'
import { InMemoryQuestionsRepository } from 'tests/repositories/in-memory-questions-repository'
import { InMemoryQuestionAttachmentsRepository } from 'tests/repositories/in-memory-question-attachments-repository'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-case/send-notification'
import { InMemoryNotificationsRepository } from 'tests/repositories/in-memory-notifications-repository'
import { makeQuestion } from 'tests/factories/make-question'
import { SpyInstance } from 'vitest'
import { waitFor } from 'tests/utils/wait-for'
import { OnQuestionBestAnswerChosen } from './on-question-best-answer-chosen'
import { InMemoryAttachmentsRepository } from 'tests/repositories/in-memory-attachments-repository'
import { InMemoryStudentsRepository } from 'tests/repositories/in-memory-students-repository'

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentsRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentsRepository
let inMemoryAnswerRepository: InMemoryAnswerRepository
let inMemoryAttachmentRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionRepository: InMemoryQuestionsRepository
let inMemoryNotificationRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('On Question Best Answer Chosen', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository,
    )
    inMemoryAttachmentRepository = new InMemoryAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository,
      inMemoryAttachmentRepository,
      inMemoryStudentsRepository,
    )
    inMemoryNotificationRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnQuestionBestAnswerChosen(
      inMemoryAnswerRepository,
      sendNotificationUseCase,
    )
  })

  it('should send a notification when an question has new best answer chosen', () => {
    const question = makeQuestion()

    const answer = makeAnswer({ questionId: question.id })

    inMemoryQuestionRepository.create(question)
    inMemoryAnswerRepository.create(answer)

    question.bestAnswerId = question.id

    inMemoryQuestionRepository.save(question)

    waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
