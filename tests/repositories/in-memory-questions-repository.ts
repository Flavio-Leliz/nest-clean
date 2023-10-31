import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { InMemoryQuestionAttachmentsRepository } from './in-memory-question-attachments-repository'
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository'
import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-object/question-details'

export class InMemoryQuestionsRepository implements QuestionRepository {
  public item: Question[] = []

  constructor(
    private questionAttachmentRepository: InMemoryQuestionAttachmentsRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository,
  ) {}

  async create(question: Question) {
    this.item.push(question)

    await this.questionAttachmentRepository.createMany(
      question.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async delete(question: Question) {
    const itemIndex = this.item.findIndex((item) => item.id === question.id)

    this.item.splice(itemIndex, 1)

    this.questionAttachmentRepository.deleteManyByQuestionId(
      question.id.toString(),
    )
  }

  async findById(id: string) {
    const question = this.item.find((item) => item.id.toString() === id)

    if (!question) {
      return null
    }

    return question
  }

  async findBySlug(slug: string) {
    const question = this.item.find((item) => item.slug.value === slug)

    if (!question) {
      return null
    }

    return question
  }

  async findDetailsBySlug(slug: string) {
    const question = this.item.find((item) => item.slug.value === slug)

    if (!question) {
      return null
    }

    const author = this.studentsRepository.item.find((student) => {
      return student.id.equals(question.authorId)
    })

    if (!author) {
      throw new Error(
        `Author with ID "${question.authorId.toString()}" does not exist`,
      )
    }

    const questionAttachments = this.questionAttachmentRepository.items.filter(
      (questionAttachment) => {
        return questionAttachment.questionId.equals(question.id)
      },
    )

    const attachments = questionAttachments.map((questionAttachment) => {
      const attachment = this.attachmentsRepository.item.find((attachment) => {
        return attachment.id.equals(questionAttachment.attachmentId)
      })

      if (!attachment) {
        throw new Error(
          `Attachment with ID "${questionAttachment.attachmentId.toString()}" does not exist`,
        )
      }

      return attachment
    })

    return QuestionDetails.create({
      questionId: question.id,
      authorId: question.authorId,
      author: author.name,
      title: question.title,
      slug: question.slug,
      content: question.content,
      attachments,
      bestAnswerId: question.bestAnswerId,
      createdAt: question.createdAt,
      updatedAt: question.updateAt,
    })
  }

  async findManyRecent(params: PaginationParams) {
    const questions = this.item
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((params.page - 1) * 20, params.page * 20)

    return questions
  }

  async save(question: Question) {
    const itemIndex = this.item.findIndex((item) => item.id === question.id)

    this.item[itemIndex] = question

    await this.questionAttachmentRepository.createMany(
      question.attachments.getNewItems(),
    )

    await this.questionAttachmentRepository.deleteMany(
      question.attachments.getRemovedItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }
}
