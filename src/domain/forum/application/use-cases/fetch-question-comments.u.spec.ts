import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionCommentsRepository } from 'tests/repositories/in-memory-question-comments-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestionComment } from 'tests/factories/make-question-comment'
import { InMemoryStudentsRepository } from 'tests/repositories/in-memory-students-repository'
import { makeStudent } from 'tests/factories/make-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase // system under test

describe('Fetch Question Comment', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository,
    )
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
    const student = makeStudent({ name: 'Exaple Silva' })

    await inMemoryStudentsRepository.item.push(student)

    const comment1 = makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })
    const comment2 = makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })
    const comment3 = makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })

    await inMemoryQuestionCommentsRepository.create(comment1)
    await inMemoryQuestionCommentsRepository.create(comment2)
    await inMemoryQuestionCommentsRepository.create(comment3)

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(result.value?.comments).toHaveLength(3)
    expect(result.value?.comments).toEqual([
      expect.objectContaining({
        author: 'Exaple Silva',
        commentId: comment1.id,
      }),
      expect.objectContaining({
        author: 'Exaple Silva',
        commentId: comment2.id,
      }),
      expect.objectContaining({
        author: 'Exaple Silva',
        commentId: comment3.id,
      }),
    ])
  })

  it('should be able to fetch paginated question comment', async () => {
    const student = makeStudent({ name: 'Exaple Silva' })

    await inMemoryStudentsRepository.item.push(student)

    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID('question-1'),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(result.value?.comments).toHaveLength(2)
  })
})
