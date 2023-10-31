import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComments } from '@/domain/forum/enterprise/entities/answer-comments'
import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-object/comment-with-author'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public item: AnswerComments[] = []

  constructor(private studentRepository: InMemoryStudentsRepository) {}

  async create(answerComments: AnswerComments) {
    this.item.push(answerComments)
  }

  async delete(answerComment: AnswerComments) {
    const itemIndex = this.item.findIndex(
      (item) => item.id === answerComment.id,
    )

    this.item.splice(itemIndex, 1)
  }

  async findById(id: string) {
    const answerComment = this.item.find((item) => item.id.toString() === id)

    if (!answerComment) {
      return null
    }

    return answerComment
  }

  async findManyByAnswerId(answerId: string, params: PaginationParams) {
    const answerComments = this.item
      .filter((item) => item.answerId.toString() === answerId)
      .slice((params.page - 1) * 20, params.page * 20)

    return answerComments
  }

  async findManyByAnswerIdCommentsWithAuthor(
    answerId: string,
    params: PaginationParams,
  ) {
    const answerComments = this.item
      .filter((item) => item.answerId.toString() === answerId)
      .slice((params.page - 1) * 20, params.page * 20)
      .map((comment) => {
        const author = this.studentRepository.item.find((student) => {
          return student.id.equals(comment.authorId)
        })

        if (!author) {
          throw new Error(
            `Author with ID "${comment.id.toString()}" does not exist`,
          )
        }

        return CommentWithAuthor.create({
          commentId: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updateAt,
          authorId: comment.authorId,
          author: author.name,
        })
      })

    return answerComments
  }
}
