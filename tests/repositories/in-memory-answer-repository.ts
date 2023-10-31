import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
// import { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachment-repository'
import { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { AnswerDetails } from '@/domain/forum/enterprise/entities/value-object/answer-details'
import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository'
import { InMemoryAnswerAttachmentsRepository } from './in-memory-answer-attachment-repository'
import { AnswerWithAuthor } from '@/domain/forum/enterprise/entities/value-object/answer-with-author'

export class InMemoryAnswerRepository implements AnswerRepository {
  public item: Answer[] = []

  constructor(
    // private answerAttachmentRepository: AnswerAttachmentRepository,
    private answerAttachmentRepository: InMemoryAnswerAttachmentsRepository,
    private attachmentRepository: InMemoryAttachmentsRepository,
    private studentRepository: InMemoryStudentsRepository,
  ) {}

  async create(answer: Answer) {
    this.item.push(answer)

    await this.answerAttachmentRepository.createMany(
      answer.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async delete(answer: Answer) {
    const itemIndex = this.item.findIndex((item) => item.id === answer.id)

    this.item.splice(itemIndex, 1)

    this.answerAttachmentRepository.deleteManyByAnswerId(answer.id.toString())
  }

  async findById(id: string) {
    const answer = this.item.find((item) => item.id.toString() === id)

    if (!answer) {
      return null
    }

    return answer
  }

  async findByAnswerWithAuthor(questionId: string, params: PaginationParams) {
    const answersWithAuthor = this.item
      .filter((item) => item.questionId.toString() === questionId)
      .slice((params.page - 1) * 20, params.page * 20)
      .map((answer) => {
        const author = this.studentRepository.item.find((student) => {
          return student.id.equals(answer.authorId)
        })

        if (!author) {
          throw new Error(
            `Author with ID "${answer.id.toString()}" does not exist`,
          )
        }

        return AnswerWithAuthor.create({
          authorId: answer.authorId,
          questionId: answer.questionId,
          content: answer.content,
          author: author.name,
          attachments: answer.attachments,
          createdAt: answer.createdAt,
          updatedAt: answer.updatedAt,
        })
      })

    return answersWithAuthor
  }

  async findDetailsById(id: string) {
    const answer = this.item.find((item) => item.id.toString() === id)

    if (!answer) {
      return null
    }

    const author = this.studentRepository.item.find((student) => {
      return student.id.equals(answer.authorId)
    })

    if (!author) {
      throw new Error(
        `Author with ID "${answer.authorId.toString()}" does not exist`,
      )
    }

    const answerAttachments = this.answerAttachmentRepository.items.filter(
      (answerAttachment) => {
        return answerAttachment.answerId.equals(answer.id)
      },
    )

    const attachments = answerAttachments.map((answerAttachment) => {
      const attachment = this.attachmentRepository.item.find((attachment) => {
        return attachment.id.equals(answerAttachment.attachmentId)
      })

      if (!attachment) {
        throw new Error(
          `Attachmet with ID "${answerAttachment.attachmentId.toString()}" does not exist`,
        )
      }

      return attachment
    })

    return AnswerDetails.create({
      answerId: answer.id,
      authorId: answer.authorId,
      author: author.name,
      content: answer.content,
      attachments,
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
    })
  }

  async findManyByQuestionId(questionId: string, params: PaginationParams) {
    const answers = this.item
      .filter((item) => item.questionId.toString() === questionId)
      .slice((params.page - 1) * 20, params.page * 20)

    return answers
  }

  async save(answer: Answer) {
    const itemIndex = this.item.findIndex((item) => item.id === answer.id)

    this.item[itemIndex] = answer

    await this.answerAttachmentRepository.createMany(
      answer.attachments.getNewItems(),
    )

    await this.answerAttachmentRepository.deleteMany(
      answer.attachments.getRemovedItems(),
    )

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }
}
