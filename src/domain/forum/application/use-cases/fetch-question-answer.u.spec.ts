import { FetchQuestionsAnswerUseCase } from './fetch-question-answer'
import { InMemoryAnswerRepository } from 'tests/repositories/in-memory-answer-repository'
import { makeAnswer } from 'tests/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from 'tests/repositories/in-memory-answer-attachment-repository'
import { InMemoryAttachmentsRepository } from 'tests/repositories/in-memory-attachments-repository'
import { InMemoryStudentsRepository } from 'tests/repositories/in-memory-students-repository'
import { makeStudent } from 'tests/factories/make-student'

let inMemoryAnswerRepository: InMemoryAnswerRepository
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: FetchQuestionsAnswerUseCase // system under test

describe('Fetch Questions Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    )
    sut = new FetchQuestionsAnswerUseCase(inMemoryAnswerRepository)
  })

  it('should be able to fetch questions answers', async () => {
    const student = makeStudent({ name: 'Example Silva' })

    await inMemoryStudentsRepository.item.push(student)

    const answer1 = makeAnswer({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
      content: 'id test',
    })
    const answer2 = makeAnswer({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })
    const answer3 = makeAnswer({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })

    await inMemoryAnswerRepository.create(answer1)
    await inMemoryAnswerRepository.create(answer2)
    await inMemoryAnswerRepository.create(answer3)

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(result.value?.answers).toHaveLength(3)
    expect(result.value?.answers).toEqual([
      expect.objectContaining({
        author: 'Example Silva',
        questionId: answer1.questionId,
      }),
      expect.objectContaining({
        author: 'Example Silva',
        questionId: answer2.questionId,
      }),
      expect.objectContaining({
        author: 'Example Silva',
        questionId: answer3.questionId,
      }),
    ])
  })

  it('should be able to fetch paginated questions answer', async () => {
    const student = makeStudent({ name: 'Example Silva' })

    await inMemoryStudentsRepository.item.push(student)

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerRepository.create(
        makeAnswer({
          questionId: new UniqueEntityID('question-1'),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(result.value?.answers).toHaveLength(2)
  })
})
