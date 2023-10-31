import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory } from 'tests/factories/make-question'
import { QuestionCommentFactory } from 'tests/factories/make-question-comment'
import { StudentFactory } from 'tests/factories/make-student'

describe('Fetch questions comments (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let questionCommentFactory: QuestionCommentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    questionCommentFactory = moduleRef.get(QuestionCommentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET]/questions/:questionId/comments', async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'Example Silva',
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    await Promise.all([
      questionCommentFactory.makePrismaQuestionComment({
        authorId: user.id,
        questionId: question.id,
        content: 'comment 1',
      }),
      questionCommentFactory.makePrismaQuestionComment({
        authorId: user.id,
        questionId: question.id,
        content: 'comment 2',
      }),
    ])

    const questionId = question.id.toString()

    const response = await request(app.getHttpServer())
      .get(`/questions/${questionId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      comment: expect.arrayContaining([
        expect.objectContaining({
          content: 'comment 1',
          author: 'Example Silva',
        }),
        expect.objectContaining({
          content: 'comment 2',
          author: 'Example Silva',
        }),
      ]),
    })
  })
})
