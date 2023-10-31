import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper'
import { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachment-repository'
import { DomainEvents } from '@/core/events/domain-events'
import { AnswerDetails } from '@/domain/forum/enterprise/entities/value-object/answer-details'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { PrismaAnswerDetailsMapper } from '../mappers/prisma-answer-details-mapper'
import { AnswerWithAuthor } from '@/domain/forum/enterprise/entities/value-object/answer-with-author'
import { PrismaAnswerWithAuthorMapper } from '../mappers/prisma-answer-with-author-mapper'

@Injectable()
export class PrismaAnswerRepository implements AnswerRepository {
  constructor(
    private prisma: PrismaService,
    private cacheRepository: CacheRepository,
    private answerAttachmentsRepository: AnswerAttachmentRepository,
  ) {}

  async create(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer)

    await this.prisma.answer.create({
      data,
    })

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async delete(answer: Answer): Promise<void> {
    await this.prisma.answer.delete({
      where: {
        id: answer.id.toString(),
      },
    })
  }

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({
      where: {
        id,
      },
    })

    if (!answer) {
      return null
    }

    return PrismaAnswerMapper.toDomain(answer)
  }

  async findByAnswerWithAuthor(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<AnswerWithAuthor[]> {
    const answer = await this.prisma.answer.findMany({
      where: {
        questionId,
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return answer.map(PrismaAnswerWithAuthorMapper.toDomain)
  }

  async findDetailsById(id: string): Promise<AnswerDetails | null> {
    const cacheHit = await this.cacheRepository.get(`answer:${id}:details`)

    if (cacheHit) {
      const cachedData = JSON.parse(cacheHit)

      return cachedData
    }

    const answer = await this.prisma.answer.findUnique({
      where: {
        id,
      },
      include: {
        author: true,
        attachments: true,
      },
    })

    if (!answer) {
      return null
    }

    const answerDetails = PrismaAnswerDetailsMapper.toDomain(answer)

    await this.cacheRepository.set(
      `answer:${id}:details`,
      JSON.stringify(answerDetails),
    )

    return answerDetails
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const answer = await this.prisma.answer.findMany({
      where: {
        questionId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return answer.map(PrismaAnswerMapper.toDomain)
  }

  async save(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer)

    await Promise.all([
      this.prisma.answer.update({
        where: {
          id: data.id,
        },
        data,
      }),

      this.answerAttachmentsRepository.createMany(
        answer.attachments.getNewItems(),
      ),

      this.answerAttachmentsRepository.deleteMany(
        answer.attachments.getRemovedItems(),
      ),

      this.cacheRepository.delete(`answer:${data.id}:details`),
    ])

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }
}
