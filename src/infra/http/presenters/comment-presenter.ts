import { Comments } from '@/domain/forum/enterprise/entities/comments'

export class CommentPresenter {
  static toHTTP(comment: Comments<any>) {
    return {
      id: comment.id.toString(),
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updateAt,
    }
  }
}
