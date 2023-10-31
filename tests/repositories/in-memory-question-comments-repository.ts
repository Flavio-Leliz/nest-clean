import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComments } from '@/domain/forum/enterprise/entities/question-comments'
import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-object/comment-with-author'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public item: QuestionComments[] = []

  constructor(private studentRepository: InMemoryStudentsRepository) {}

  async create(questionComments: QuestionComments) {
    this.item.push(questionComments)
  }

  async delete(questionComments: QuestionComments) {
    const itemIndex = this.item.findIndex(
      (item) => item.id === questionComments.id,
    )

    this.item.splice(itemIndex, 1)
  }

  async findById(id: string) {
    const questionComment = this.item.find((item) => item.id.toString() === id)

    if (!questionComment) {
      return null
    }

    return questionComment
  }

  async findManyByQuestionId(questionId: string, params: PaginationParams) {
    const questionComments = this.item
      .filter((item) => item.questionId.toString() === questionId)
      .slice((params.page - 1) * 20, params.page * 20)

    return questionComments
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    params: PaginationParams,
  ) {
    const questionComment = this.item
      .filter((item) => item.questionId.toString() === questionId)
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

    return questionComment
  }
}
