import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerCommentsRepository } from 'tests/repositories/in-memory-answer-comments-repository'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerComment } from 'tests/factories/make-answer-comment'
import { InMemoryStudentsRepository } from 'tests/repositories/in-memory-students-repository'
import { makeStudent } from 'tests/factories/make-student'

let inMemoryStudentRepository: InMemoryStudentsRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase // system under test

describe('Fetch Answer Comment', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentsRepository()
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentRepository,
    )
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    const student = makeStudent({ name: 'Example Silva' })

    await inMemoryStudentRepository.item.push(student)

    const comment1 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    })
    const comment2 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    })
    const comment3 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    })

    await inMemoryAnswerCommentsRepository.create(comment1)
    await inMemoryAnswerCommentsRepository.create(comment2)
    await inMemoryAnswerCommentsRepository.create(comment3)

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(result.value?.comments).toHaveLength(3)
    expect(result.value?.comments).toEqual([
      expect.objectContaining({
        author: 'Example Silva',
        commentId: comment1.id,
      }),
      expect.objectContaining({
        author: 'Example Silva',
        commentId: comment2.id,
      }),
      expect.objectContaining({
        author: 'Example Silva',
        commentId: comment3.id,
      }),
    ])
  })

  it('should be able to fetch paginated answer comment', async () => {
    const student = makeStudent({ name: 'Example Silva' })

    await inMemoryStudentRepository.item.push(student)

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID('answer-1'),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    expect(result.value?.comments).toHaveLength(2)
  })
})
