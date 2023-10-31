import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerQuestionUseCase } from './answer-question'
import { InMemoryAnswerRepository } from 'tests/repositories/in-memory-answer-repository'
import { InMemoryAnswerAttachmentsRepository } from 'tests/repositories/in-memory-answer-attachment-repository'

let inMemoryAnswerRepository: InMemoryAnswerRepository
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentsRepository
let sut: AnswerQuestionUseCase // system under test

describe('Answer Question', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository,
    )
    sut = new AnswerQuestionUseCase(inMemoryAnswerRepository)
  })

  it('should be to create an answer', async () => {
    const result = await sut.execute({
      questionId: '1',
      authorId: '1',
      content: 'nova resposta',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAnswerRepository.item[0]).toEqual(result.value?.answer)
    expect(
      inMemoryAnswerRepository.item[0].attachments.currentItems,
    ).toHaveLength(2)
    expect(inMemoryAnswerRepository.item[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ])
  })

  it('should persist attachments when creating a new answer', async () => {
    const result = await sut.execute({
      authorId: '1',
      questionId: '1',
      content: 'conteúdo da answer criada',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAnswerAttachmentRepository.items).toHaveLength(2)
    expect(inMemoryAnswerAttachmentRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID('2'),
        }),
      ]),
    )
  })
})
