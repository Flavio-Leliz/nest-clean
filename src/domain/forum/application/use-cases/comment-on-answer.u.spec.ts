import { makeAnswer } from 'tests/factories/make-answer'
import { CommentOnAnswerUseCase } from './comment-on-answer'
import { InMemoryAnswerRepository } from 'tests/repositories/in-memory-answer-repository'
import { InMemoryAnswerCommentsRepository } from 'tests/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswerAttachmentsRepository } from 'tests/repositories/in-memory-answer-attachment-repository'
import { InMemoryStudentsRepository } from 'tests/repositories/in-memory-students-repository'

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswerRepository: InMemoryAnswerRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: CommentOnAnswerUseCase // system under test

describe('Comment On Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository,
    )
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    )
    sut = new CommentOnAnswerUseCase(
      inMemoryAnswerRepository,
      inMemoryAnswerCommentsRepository,
    )
  })

  it('should be able to comment answer', async () => {
    const answer = makeAnswer()

    await inMemoryAnswerRepository.create(answer)

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: 'testando comment answer',
    })

    expect(inMemoryAnswerCommentsRepository.item[0].content).toEqual(
      'testando comment answer',
    )
  })
})
