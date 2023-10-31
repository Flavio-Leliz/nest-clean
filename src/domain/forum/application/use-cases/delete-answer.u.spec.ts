import { InMemoryAnswerAttachmentsRepository } from 'tests/repositories/in-memory-answer-attachment-repository'
import { InMemoryAnswerRepository } from 'tests/repositories/in-memory-answer-repository'
import { DeleteAnswerUseCase } from './delete-answer'
import { makeAnswer } from 'tests/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswerAttachment } from 'tests/factories/make-answer-attachments'
import { NotAllowedError } from '@/core/errors/error/not-allowed-error'

let inMemoryAnswerRepository: InMemoryAnswerRepository
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentsRepository
let sut: DeleteAnswerUseCase // system under test

describe('Delete Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository,
    )
    sut = new DeleteAnswerUseCase(inMemoryAnswerRepository)
  })

  it('should be able to delete a answer', async () => {
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
      answerId: newAnswer.id.toString(),
      authorId: 'author-1',
    })

    const findAnswer = await inMemoryAnswerRepository.findById(
      newAnswer.id.toString(),
    )

    expect(inMemoryAnswerRepository.item).toHaveLength(0)
    expect(inMemoryAnswerAttachmentRepository.items).toHaveLength(0)

    expect(findAnswer).toEqual(null)
  })

  it('should not be able to delete a answer from another user', async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueEntityID('author-1'),
    })

    await inMemoryAnswerRepository.create(newAnswer)

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
