import { InMemoryStudentsRepository } from 'tests/repositories/in-memory-students-repository'
import { FakeHasher } from 'tests/cryptography/fake-hasher'
import { FakeEncrypter } from 'tests/cryptography/fake-encrypter'
import { AuthenticateStudentUseCase } from './authenticate-student'
import { makeStudent } from 'tests/factories/make-student'

let inMemoryStudentRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateStudentUseCase // system under test

describe('Authenticate Student', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateStudentUseCase(
      inMemoryStudentRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a student', async () => {
    const student = makeStudent({
      email: 'example@email.com',
      password: await fakeHasher.hash('123'),
    })

    inMemoryStudentRepository.item.push(student)

    const result = await sut.execute({
      email: 'example@email.com',
      password: '123',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
