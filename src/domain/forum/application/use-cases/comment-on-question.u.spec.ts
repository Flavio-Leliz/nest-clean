import { InMemoryQuestionsRepository } from 'tests/repositories/in-memory-questions-repository'
import { makeQuestion } from 'tests/factories/make-question'
import { InMemoryQuestionCommentsRepository } from 'tests/repositories/in-memory-question-comments-repository'
import { CommentOnQuestionUseCase } from './comment-on-question'
import { InMemoryQuestionAttachmentsRepository } from 'tests/repositories/in-memory-question-attachments-repository'
import { InMemoryStudentsRepository } from 'tests/repositories/in-memory-students-repository'
import { InMemoryAttachmentsRepository } from 'tests/repositories/in-memory-attachments-repository'

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: CommentOnQuestionUseCase // system under test

describe('Comment On Question', () => {
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
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository,
    )
    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionRepository,
      inMemoryQuestionCommentsRepository,
    )
  })

  it('should be able to comment question', async () => {
    const question = makeQuestion()

    await inMemoryQuestionRepository.create(question)

    await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: 'testando comment question',
    })

    expect(inMemoryQuestionCommentsRepository.item[0].content).toEqual(
      'testando comment question',
    )
  })
})
