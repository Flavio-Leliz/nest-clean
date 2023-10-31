import { EditAnswerUseCase } from './edit-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'tests/factories/make-answer'
import { InMemoryAnswerRepository } from 'tests/repositories/in-memory-answer-repository'
import { NotAllowedError } from '../../../../core/errors/error/not-allowed-error'
import { InMemoryAnswerAttachmentsRepository } from 'tests/repositories/in-memory-answer-attachment-repository'
import { makeAnswerAttachment } from 'tests/factories/make-answer-attachments'

let inMemoryAnswerRepository: InMemoryAnswerRepository
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentsRepository
let sut: EditAnswerUseCase // system under test

describe('Edit Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository,
    )

    sut = new EditAnswerUseCase(
      inMemoryAnswerRepository,
      inMemoryAnswerAttachmentRepository,
    )
  })

  it('should be able to edit a answer', async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueEntityID('author-1'),
    })

    await inMemoryAnswerRepository.create(newAnswer)

    await inMemoryAnswerAttachmentRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    await sut.execute({
      authorId: 'author-1',
      answerId: newAnswer.id.toString(),
      content: 'testando edit answer',
      attachmentsIds: ['1', '3'],
    })

    await inMemoryAnswerRepository.findById(newAnswer.id.toString())

    expect(inMemoryAnswerRepository.item[0]).toMatchObject({
      content: 'testando edit answer',
    })
    expect(
      inMemoryAnswerRepository.item[0].attachments.currentItems,
    ).toHaveLength(2)
    expect(inMemoryAnswerRepository.item[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ])
  })

  it('should not be able to edit a answer from another user', async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueEntityID('author-1'),
    })

    await inMemoryAnswerRepository.create(newAnswer)

    const result = await sut.execute({
      authorId: 'author-2',
      answerId: newAnswer.id.toString(),
      content: 'testando edit answer',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should sync new and remove attachments when editing a answer', async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueEntityID('author-1'),
    })

    await inMemoryAnswerRepository.create(newAnswer)

    await inMemoryAnswerAttachmentRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    const result = await sut.execute({
      authorId: 'author-1',
      answerId: newAnswer.id.toString(),
      content: 'testando edit question content',
      attachmentsIds: ['1', '3'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAnswerAttachmentRepository.items).toHaveLength(2)
    expect(inMemoryAnswerAttachmentRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID('3'),
        }),
      ]),
    )
  })
})
