import { DomainEvents } from '@/core/events/domain-events'
import { StudentRepository } from '@/domain/forum/application/repositories/students-repository'
import { Student } from '@/domain/forum/enterprise/entities/student'

export class InMemoryStudentsRepository implements StudentRepository {
  public item: Student[] = []

  async create(student: Student) {
    this.item.push(student)

    DomainEvents.dispatchEventsForAggregate(student.id)
  }

  async findByEmail(email: string) {
    const student = this.item.find((item) => item.email.toString() === email)

    if (!student) {
      return null
    }

    return student
  }
}
