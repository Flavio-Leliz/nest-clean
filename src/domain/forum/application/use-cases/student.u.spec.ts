import { RegisterStudentUseCase } from './register-student'
import { InMemoryStudentsRepository } from 'tests/repositories/in-memory-students-repository'
import { FakeHasher } from 'tests/cryptography/fake-hasher'

let inMemoryStudentRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let sut: RegisterStudentUseCase // system under test

describe('Register Student', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterStudentUseCase(inMemoryStudentRepository, fakeHasher)
  })

  it('should be able to register a new student', async () => {
    const result = await sut.execute({
      name: 'Flavio Leliz',
      email: 'example@email.com',
      password: '123',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      student: inMemoryStudentRepository.item[0],
    })
  })

  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'Flavio Leliz',
      email: 'example@email.com',
      password: '123',
    })

    const hashedPassword = await fakeHasher.hash('123')

    expect(result.isRight()).toBe(true)
    expect(inMemoryStudentRepository.item[0].password).toEqual(hashedPassword)
  })
})
