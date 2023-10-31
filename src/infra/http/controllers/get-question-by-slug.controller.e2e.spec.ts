import { Slug } from '@/domain/forum/enterprise/entities/value-object/slug'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AttachmentFactory } from 'tests/factories/make-attachment'
import { QuestionFactory } from 'tests/factories/make-question'
import { QuestionAttachmentFactory } from 'tests/factories/make-question-attachments'
import { StudentFactory } from 'tests/factories/make-student'

describe('Get Question By Slug (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory
  let questionAttachmentFactory: QuestionAttachmentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET]/questions/:slug', async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'Example Silva',
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
      title: 'question 01',
      slug: Slug.create('question-01'),
    })

    const attachment = await attachmentFactory.makePrismaAttachment({
      title: 'Attachment to test',
    })

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    })

    const response = await request(app.getHttpServer())
      .get(`/questions/question-01`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      question: expect.objectContaining({
        title: 'question 01',
        author: 'Example Silva',
        attachments: [
          expect.objectContaining({
            title: 'Attachment to test',
          }),
        ],
      }),
    })
  })
})
