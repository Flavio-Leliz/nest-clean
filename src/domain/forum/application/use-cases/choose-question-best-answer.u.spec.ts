import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'tests/factories/make-answer'
import { InMemoryAnswerRepository } from 'tests/repositories/in-memory-answer-repository'
import { InMemoryQuestionsRepository } from 'tests/repositories/in-memory-questions-repository'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'
import { makeQuestion } from 'tests/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'tests/repositories/in-memory-question-attachments-repository'
import { InMemoryAnswerAttachmentsRepository } from 'tests/repositories/in-memory-answer-attachment-repository'
import { InMemoryAttachmentsRepository } from 'tests/repositories/in-memory-attachments-repository'
import { InMemoryStudentsRepository } from 'tests/repositories/in-memory-students-repository'

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let inMemoryAnswerRepository: InMemoryAnswerRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: ChooseQuestionBestAnswerUseCase // system under test

describe('Choose Question Best Answer', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    )
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository,
    )
    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionRepository,
      inMemoryAnswerRepository,
    )
  })

  it('should be able to choose the question best answer', async () => {
    const question = makeQuestion()

    const answer = makeAnswer({
      questionId: question.id,
    })

    await inMemoryQuestionRepository.create(question)
    await inMemoryAnswerRepository.create(answer)

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    })

    expect(inMemoryQuestionRepository.item[0].bestAnswerId).toEqual(answer.id)
  })

  it('should not be able to choose another user question best answer', async () => {
    const question = makeQuestion({
      authorId: new UniqueEntityID('author-1'),
    })

    const answer = makeAnswer({
      questionId: question.id,
    })

    await inMemoryQuestionRepository.create(question)
    await inMemoryAnswerRepository.create(answer)

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
  })
})
