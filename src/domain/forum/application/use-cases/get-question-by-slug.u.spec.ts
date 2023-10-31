import { InMemoryQuestionsRepository } from 'tests/repositories/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { makeQuestion } from 'tests/factories/make-question'
import { Slug } from '../../enterprise/entities/value-object/slug'
import { InMemoryQuestionAttachmentsRepository } from 'tests/repositories/in-memory-question-attachments-repository'
import { InMemoryAttachmentsRepository } from 'tests/repositories/in-memory-attachments-repository'
import { InMemoryStudentsRepository } from 'tests/repositories/in-memory-students-repository'
import { makeStudent } from 'tests/factories/make-student'
import { makeAttachment } from 'tests/factories/make-attachment'
import { makeQuestionAttachment } from 'tests/factories/make-question-attachments'

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: GetQuestionBySlugUseCase // system under test

describe('Get Question By Slug', () => {
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
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionRepository)
  })

  it('should be able to get a question by slug', async () => {
    const student = makeStudent({ name: 'Example Silva' })

    await inMemoryStudentsRepository.item.push(student)

    const newQuestion = makeQuestion({
      authorId: student.id,
      slug: Slug.create('example-question'),
    })

    await inMemoryQuestionRepository.create(newQuestion)

    const attachment = makeAttachment({ title: 'Attachment to test' })

    await inMemoryAttachmentsRepository.item.push(attachment)

    const questionAttachment = makeQuestionAttachment({
      attachmentId: attachment.id,
      questionId: newQuestion.id,
    })

    await inMemoryQuestionAttachmentsRepository.items.push(questionAttachment)

    const result = await sut.execute({
      slug: 'example-question',
    })

    expect(result.isRight()).toBeTruthy()

    if (result.isRight()) {
      expect(result.value).toMatchObject({
        question: expect.objectContaining({
          title: newQuestion.title,
          author: 'Example Silva',
          attachments: [
            expect.objectContaining({
              title: 'Attachment to test',
            }),
          ],
        }),
      })
    }
  })
})
